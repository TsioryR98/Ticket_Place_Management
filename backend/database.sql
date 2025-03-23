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
        status_order VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    order_items (
        order_item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        order_id uuid NOT NULL,
        ticket_id uuid OT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        created_at TIMESTAMP DEFAULT NOW (),
        FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
        FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) ON DELETE SET NULL
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
    ), --
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
    ), ---
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