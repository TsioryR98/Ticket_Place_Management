--These are all inserts with appropriate tables, change.env for local testing 
CREATE DATABASE ticket_management;

--uuid_generate_v4 () random uuid
--ALTER TABLE events ADD COLUMN imagepath VARCHAR(255) DEFAULT NULL;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
CREATE TABLE
    users (
        user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        user_name VARCHAR(255) UNIQUE NOT NULL,
        user_email VARCHAR(255) UNIQUE NOT NULL,
        user_passwords TEXT NOT NULL,
        "role" VARCHAR(50) NOT NULL DEFAULT 'user' CHECK ("role" IN ('admin', 'user')),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    events (
        event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        title VARCHAR(255) NOT NULL,
        descriptions TEXT,
        event_datetime TIMESTAMP NOT NULL,
        locations VARCHAR(255) NOT NULL,
        organizer VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW (),
        imagepath VARCHAR(255) DEFAULT NULL
    );

CREATE TABLE
    tickets (
        ticket_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        event_id uuid,
        types VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        available INT NOT NULL CHECK (available >= 0),
        limit_per_person INT NOT NULL CHECK (limit_per_person > 0),
        created_at TIMESTAMP DEFAULT NOW (),
        FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
    );

CREATE TABLE
    orders (
        order_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        user_id uuid REFERENCES users (user_id) ON DELETE SET NULL,
        total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    order_items (
        order_item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        order_id uuid NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
        ticket_id uuid REFERENCES tickets (ticket_id) ON DELETE SET NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        created_at TIMESTAMP DEFAULT NOW ()
    );

---SQL SCRIPTS---
---take event with ticket details
SELECT
    *
FROM
    events e
    LEFT JOIN tickets t ON e.event_id = t.event_id
WHERE
    e.event_id = '8939ff10-7401-4d29-bbe3-c79f3d7a7ed8';

-- UPDATE event just for { description, date, time, location }
UPDATE events
SET
    descriptions = ?,
    event_datetime = ?,
    locations = ?
WHERE
    event_id = ? RETURNING *
    ---INSERT EVENT 
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        created_at
    )
VALUES
    (
        'Tech Conference 2025',
        'Discover the latest trends and innovations in technology.',
        '2025-06-10 09:00:00',
        'Palais des Congrès, Paris',
        'TechWorld',
        'Technology',
        NOW ()
    ),
    (
        'Music Festival 2025',
        'Experience live performances from top international artists.',
        '2025-07-20 18:00:00',
        'Olympic Stadium, Lyon',
        'MusicFest',
        'Music',
        NOW ()
    ),
    --
    (
        'Book Fair',
        'Meet your favorite authors and discover the latest releases.',
        '2025-09-15 10:00:00',
        'Expo Center, Marseille',
        'Books & Culture',
        'Literature',
        NOW ()
    ),
    (
        'eSport Competition',
        'Watch top teams battle it out in an intense gaming showdown.',
        '2025-11-05 14:00:00',
        'Gaming Arena, Bordeaux',
        'eSport League',
        'Gaming',
        NOW ()
    ),
    (
        'Art Exhibition',
        'Explore breathtaking art from world-renowned artists.',
        '2025-04-12 11:00:00',
        'Modern Art Museum, Nice',
        'ArtWorld',
        'Art',
        NOW ()
    ),
    ---
    (
        'Cooking Workshop',
        'Learn to cook gourmet dishes with professional chefs.',
        '2025-03-18 10:00:00',
        'Culinary Institute, Lille',
        'Chef''s Table',
        'Food',
        NOW ()
    ),
    (
        'Science Fair',
        'Discover the latest innovations in science and technology.',
        '2025-05-01 09:30:00',
        'Innovation Center, Toulouse',
        'SciExpo',
        'Science',
        NOW ()
    ),
    (
        'Marathon for Charity',
        'Join us for a charity marathon to support local communities.',
        '2025-09-10 07:00:00',
        'Central Park, Nantes',
        'Charity Runs',
        'Sports',
        NOW ()
    ),
    (
        'Winter Gala',
        'An elegant evening of music, dance, and fine dining.',
        '2025-12-15 20:00:00',
        'Grand Ballroom, Bordeaux',
        'Gala Events',
        'Entertainment',
        NOW ()
    ),
    (
        'Outdoor Movie Night',
        'Enjoy a classic film under the stars with friends and family.',
        '2025-08-22 20:30:00',
        'Open Air Cinema, Montpellier',
        'Cinema Lovers',
        'Movies',
        NOW ()
    );

---TICKETS
INSERT INTO
    tickets (
        event_id,
        types,
        price,
        available,
        limit_per_person,
        created_at
    )
VALUES
    -- Tickets for Tech Conference 2025 (event-1)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Tech Conference 2025'
        ),
        'VIP',
        150.00,
        20,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Tech Conference 2025'
        ),
        'Standard',
        80.00,
        50,
        5,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Tech Conference 2025'
        ),
        'Early Bird',
        50.00,
        10,
        1,
        NOW ()
    ),
    -- Tickets for Music Festival 2025 (event-2)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Music Festival 2025'
        ),
        'VIP',
        200.00,
        30,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Music Festival 2025'
        ),
        'Standard',
        100.00,
        100,
        5,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Music Festival 2025'
        ),
        'Early Bird',
        70.00,
        20,
        1,
        NOW ()
    ),
    -- Tickets for Book Fair (event-3)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Book Fair'
        ),
        'VIP',
        50.00,
        15,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Book Fair'
        ),
        'Standard',
        25.00,
        60,
        5,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Book Fair'
        ),
        'Early Bird',
        15.00,
        10,
        1,
        NOW ()
    ),
    -- Tickets for eSport Competition (event-4)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'eSport Competition'
        ),
        'VIP',
        120.00,
        25,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'eSport Competition'
        ),
        'Standard',
        60.00,
        80,
        5,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'eSport Competition'
        ),
        'Early Bird',
        40.00,
        15,
        1,
        NOW ()
    ),
    -- Tickets for Art Exhibition (event-5)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Art Exhibition'
        ),
        'VIP',
        100.00,
        10,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Art Exhibition'
        ),
        'Standard',
        50.00,
        40,
        4,
        NOW ()
    ),
    -- Tickets for Cooking Workshop (event-6)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Cooking Workshop'
        ),
        'VIP',
        300.00,
        5,
        1,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Cooking Workshop'
        ),
        'Standard',
        150.00,
        20,
        2,
        NOW ()
    ),
    -- Tickets for Science Fair (event-7)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Science Fair'
        ),
        'VIP',
        120.00,
        15,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Science Fair'
        ),
        'Standard',
        60.00,
        50,
        4,
        NOW ()
    ),
    -- Tickets for Marathon for Charity (event-8)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Marathon for Charity'
        ),
        'Participation',
        20.00,
        500,
        1,
        NOW ()
    ),
    -- Tickets for Winter Gala (event-9)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Winter Gala'
        ),
        'VIP',
        250.00,
        20,
        2,
        NOW ()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Winter Gala'
        ),
        'Standard',
        120.00,
        50,
        3,
        NOW ()
    ),
    -- Tickets for Outdoor Movie Night (event-10)
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Outdoor Movie Night'
        ),
        'Standard',
        10.00,
        100,
        4,
        NOW ()
    );

    BEGIN;




-----INSERT FOR ORDER -------------







-- Récupérer les informations actuelles
SELECT oi.quantity as old_quantity, oi.price, oi.ticket_id, t.available
FROM order_items oi
JOIN tickets t ON oi.ticket_id = t.ticket_id
WHERE oi.order_item_id = $1
FOR UPDATE;

-- Calculer la différence de quantité
-- Mettre à jour l'article
UPDATE order_items
SET quantity = $2
WHERE order_item_id = $1;

-- Mettre à jour la disponibilité du ticket
UPDATE tickets
SET available = available + ($3 - $2)
WHERE ticket_id = $4;

-- Mettre à jour le total de la commande
UPDATE orders
SET total_amount = total_amount + (($2 - $3) * $5)
WHERE order_id = $6;

COMMIT;


-- Order 1 for user1 (a2a7ab5d-08de-40a6-a264-7cf54bd99f5e)
INSERT INTO orders (user_id, total_amount) 
VALUES ('a2a7ab5d-08de-40a6-a264-7cf54bd99f5e', 270.00);

-- Order items for order 1 (assuming some tickets exist)

-- VIP ticket for event d8344a6b-7cf4-43bb-9a0e-b07bc5bd9ff4 (1 ticket)
INSERT INTO order_items (order_id, ticket_id, quantity, price)
VALUES ('d7817f40-88f0-48dc-aa93-31534bc34db3', '9dfff25d-05d8-4744-896f-da1ba561c50a', 1, 200.00);

-- Early Bird ticket for event db42b716-fb48-4726-a09f-f3bd3be422e7 (1 ticket)
INSERT INTO order_items (order_id, ticket_id, quantity, price)
VALUES ('d7817f40-88f0-48dc-aa93-31534bc34db3', '00e0eda7-1d9d-4111-a2d6-d31bbb0f3fc0', 1, 70.00);



---Order 2 for user2 (0165f456-6e80-4c81-a170-90408a832f0a)

INSERT INTO orders (user_id, total_amount) 
VALUES ('0165f456-6e80-4c81-a170-90408a832f0a', 175.00);


-- Standard ticket for event 9d515b65-4cac-4400-913d-3c28772752e7 (2 tickets)
INSERT INTO order_items (order_id, ticket_id, quantity, price)
VALUES ('bd5c3efb-899f-4a63-b108-a6aba992c0d5', 'f98cb3ce-a230-4029-bdc3-d348011f7e9b', 2, 25.00);

-- Early Bird ticket for event ea5af19b-7e93-43a1-86d9-40b3466e2b6b (1 ticket)
INSERT INTO order_items ( order_id, ticket_id, quantity, price)
VALUES ('bd5c3efb-899f-4a63-b108-a6aba992c0d5', 'bdb01ceb-50a3-404e-9c82-efdfd03cf1f4', 1, 40.00);

-- Participation ticket for event 6d05d771-64b4-4475-8650-be70a1aa6935 (3 tickets)
INSERT INTO order_items (order_id, ticket_id, quantity, price)
VALUES ('bd5c3efb-899f-4a63-b108-a6aba992c0d5', '54e4f8e0-ba85-4b8f-b7f8-c8d2de8c6c44', 3, 20.00);



-- View order details with items
SELECT 
    o.order_id,
    u.user_name,
    e.title,
    t.types,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS item_total
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN users u ON o.user_id = u.user_id
LEFT JOIN tickets t ON oi.ticket_id = t.ticket_id
LEFT JOIN events e ON t.event_id = e.event_id;
WHERE u.user_id='a2a7ab5d-08de-40a6-a264-7cf54bd99f5e';
