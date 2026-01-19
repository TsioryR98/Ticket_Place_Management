--These are all inserts with appropriate tables, change.env for local testing 
CREATE DATABASE ticket_management;

--uuid_generate_v4 () random uuid
--ALTER TABLE events ADD COLUMN imagepath VARCHAR(255) DEFAULT NULL;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_name VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_passwords TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user' CHECK ("role" IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT NOW ()
);

CREATE TABLE user_providers (
    provider_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    provider_name VARCHAR(50) NOT NULL, --'google', 'facebook'
    provider_account_id VARCHAR(255) NOT NULL, -- id from provider
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider_name, provider_account_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE events (
    event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title VARCHAR(255) NOT NULL,
    descriptions TEXT,
    event_datetime TIMESTAMP NOT NULL,
    locations VARCHAR(255) NOT NULL,
    organizer VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW (),
    imagepath VARCHAR(255) DEFAULT NULL,
    event_status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (
        event_status IN ('published', 'draft', 'cancelled')
    )
);

-- Add a new column for event status
ALTER TABLE
    events
ADD
    COLUMN event_status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (
        event_status IN ('Published', 'Draft', 'Cancelled')
    );

CREATE TABLE tickets (
    ticket_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    event_id uuid,
    types VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available INT NOT NULL CHECK (available >= 0),
    limit_per_person INT NOT NULL CHECK (limit_per_person > 0),
    created_at TIMESTAMP DEFAULT NOW (),
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id uuid REFERENCES users (user_id) ON DELETE
    SET
        NULL,
        total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
        status_order VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
            status_order IN ('pending', 'completed', 'cancelled')
        ),
        created_at TIMESTAMP DEFAULT NOW ()
);

CREATE TABLE order_items (
    order_item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    order_id uuid NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
    ticket_id uuid REFERENCES tickets (ticket_id) ON DELETE
    SET
        NULL,
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
UPDATE
    events
SET
    descriptions = ?,
    event_datetime = ?,
    locations = ?
WHERE
    event_id = ? RETURNING * ---INSERT EVENT 
    -- The Cinelli Brothers @ Le Blues Autour du Zinc
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'The Cinelli Brothers live @ Le Blues Autour du Zinc',
        'The Cinelli Brothers, un groupe de blues primé, se produira dans le cadre du festival Le Blues Autour du Zinc. Venez profiter de leur mélange unique de blues traditionnel et de rock moderne.',
        '2025-04-12 18:00:00',
        'Maladrerie Saint-Lazare de Voisinlieu, 203 Rue de Paris, Beauvais, France',
        'Le Blues Autour du Zinc',
        'Musique',
        'https://photos.bandsintown.com/thumb/19758718.jpeg'
    );

-- Bernard (FR) @ Pub Montmartre
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Bernard (FR) en concert',
        'BERNARD c''est des chansons, mais les références vont plutôt du rock''n roll aux goguettes, en passant par le punk. L''avis généralement partagé par les publics à Bernard est souvent enthousiaste.',
        '2025-04-15 18:30:00',
        'Pub Montmartre, 11 Rue Joseph de Maistre, Paris, France',
        'Pub Montmartre',
        'Musique',
        'https://photos.bandsintown.com/thumb/13287446.jpeg'
    );

-- Rosa Bursztein @ THEATRE DE L'OEUVRE
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Rosa Bursztein : Dédoublée',
        'Dans ce nouveau spectacle, Rosa poursuit son récit sur la quête amoureuse et creuse ses contradictions de mauvaise féministe, de mauvaise écologiste et de mauvaise gauchiste !',
        '2025-04-18 19:00:00',
        'THEATRE DE L''OEUVRE, 55 Rue de Clichy, PARIS, France',
        'THEATRE DE L''OEUVRE',
        'Théâtre',
        'https://photos.bandsintown.com/thumb/20575489.jpeg'
    );

-- Bermud @ SUPERSONIC
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Bermud en concert',
        'Bermud, groupe de rock alternatif, se produira au SUPERSONIC pour une soirée énergique remplie de leurs meilleurs titres et de nouvelles compositions.',
        '2025-04-20 19:00:00',
        'SUPERSONIC, 9 Rue Biscornet, Paris, France',
        'SUPERSONIC',
        'Musique',
        'https://assets.prod.bandsintown.com/images/homeIcon/festivalPlaceHolderImage/08.png'
    );

-- FENCES + THE INTERSPHERE @ La Boule Noire
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'FENCES + THE INTERSPHERE',
        'Soirée exceptionnelle avec FENCES et THE INTERSPHERE, deux groupes de rock alternatif qui promettent une performance électrisante dans l''intimité de La Boule Noire.',
        '2025-04-22 19:00:00',
        'La Boule Noire, 120 Blvd de Rochechouart, Paris, France',
        'La Boule Noire',
        'Musique',
        'https://photos.bandsintown.com/thumb/20350088.jpeg'
    );

-- The Intersphere @ La Boule Noire
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'The Intersphere en concert',
        'Ce quatuor allemand propose des mélodies accrocheuses, des harmonies dramatiques et des structures épiques, souvent comparées à celles de Biffy Clyro, Muse, Royal Blood ou Thrice.',
        '2025-04-25 19:30:00',
        'La Boule Noire, 120 Blvd de Rochechouart, Paris, France',
        'VERYSHOW PRODUCTIONS',
        'Musique',
        'https://photos.bandsintown.com/thumb/19222586.jpeg'
    );

-- Biga*Ranx @ LA CIGALE
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Biga*Ranx à La Cigale',
        'Retrouvez Biga*Ranx pour trois dates exceptionnelles à La Cigale. Un show énergique mêlant hip-hop et influences urbaines dans une ambiance explosive.',
        '2025-04-27 19:30:00',
        'La Cigale, 120 Boulevard de Rochechouart, Paris, France',
        'La Cigale',
        'Musique',
        'https://photos.bandsintown.com/thumb/18342437.jpeg'
    );

-- Droges @ FGO-Barbara
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Droges en concert',
        'Droges, groupe de rock indépendant, se produira au FGO-Barbara pour une soirée intimiste avec leurs compositions originales et énergiques.',
        '2025-05-02 20:00:00',
        'FGO-Barbara, 1 Rue Fleury, Paris, France',
        'FGO-Barbara',
        'Musique',
        'https://photos.bandsintown.com/thumb/16644251.jpeg'
    );

-- Gaffa Tape Sandy @ Le Klub
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Gaffa Tape Sandy',
        'Trois ami·e·s, une petite ville endormie du sud de l''Angleterre et l''envie de créer quelque chose de fort et d''excitant. Le trio présente son premier album dans une tournée européenne.',
        '2025-05-05 19:30:00',
        'Le Klub, 14 rue Saint Denis, Paris, France',
        'Hex.Post',
        'Musique',
        'https://photos.bandsintown.com/thumb/16981990.jpeg'
    );

-- Gavin James @ LE TRABENDO
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Gavin James en concert',
        'Peu d''auteurs-compositeurs-interprètes sont aussi capables que Gavin James de capturer l''essence de nos vies intimes - l''amour, le chagrin, la perte, la joie.',
        '2025-05-08 20:00:00',
        'LE TRABENDO (Parc de la Villette), Av J.Jaures /Metro Pte de Pantin, Paris, France',
        'Take Me Out',
        'Musique',
        'https://photos.bandsintown.com/thumb/11435284.jpeg'
    );

-- Gad Elmaleh @ Elispace
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Gad Elmaleh : Lui-même',
        'Gad Elmaleh présente son nouveau spectacle "Lui-même", un one-man-show hilarant où il explore avec autodérision son parcours et ses observations sur la société moderne.',
        '2025-05-10 20:00:00',
        'Elispace, 3 Avenue Paul Henri Spaak, Beauvais, France',
        'Elispace',
        'Humour',
        'https://photos.bandsintown.com/thumb/8685903.jpeg'
    );

-- OMED @ Bonnie Club
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'OMED au Bonnie Club',
        'Soirée ASOKA au Bonnie Club avec OMED en tête d''affiche. Une nuit de musique électronique et de fête jusqu''au petit matin.',
        '2025-05-15 23:00:00',
        'Bonnie Club, 17 Boulevard Morland, Paris, France',
        'Bonnie Club',
        'Clubbing',
        'https://assets.prod.bandsintown.com/images/homeIcon/festivalPlaceHolderImage/05.png'
    );

-- Stax @ Les Apaches
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Anniversaire DJ Aleathory aux Apaches',
        'Soirée anniversaire de DJ Aleathory sous le signe de la house et de la techno. Line up: Stax, Cò Binh, Loucid, Acid Oslo, Aleathory.',
        '2025-05-18 18:00:00',
        'Les Apaches, 99 Rue de Ménilmontant, Paris, France',
        'Les Apaches',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/6204033.jpeg'
    );

-- Mae Andrazz @ Protestant Evangelical Church
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Mae Andrazz : Ombre et Lumière',
        'Mae Andrazz donne son tout premier concert, en version live acoustique! "Ombre & Lumière", son premier album, est l''histoire de son traumatisme d''enfance et du long processus de guérison.',
        '2025-05-20 20:00:00',
        'Protestant Evangelical Church, 41 Av. du 8 Mai 1945, Palaiseau, France',
        'Protestant Evangelical Church',
        'Musique',
        'https://photos.bandsintown.com/thumb/20823573.jpeg'
    );

-- Meskerem Mees @ MC93
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Meskerem Mees: Rosas - Exit Above',
        'Spectacle de danse et musique prenant comme point de départ les cadences chaloupées de la chanson Walking Blues de Robert Johnson et le principe fondateur d''Anne Teresa De Keersmaeker.',
        '2025-05-22 20:00:00',
        'MC93 - Maison de la Culture de Seine-Saint-Denis, 9 Bd Lénine, Bobigny, France',
        'MC93',
        'Danse',
        'https://photos.bandsintown.com/thumb/17643897.jpeg'
    );

-- Locomuerte @ L''Empreinte
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Locomuerte - Warm-Up Plane''r Fest',
        'Échauffement pour le Plane''r Fest avec Locomuerte, Vertex et When Reasons Collapse. Une soirée rock énergique pour préparer le festival à venir.',
        '2025-05-25 20:00:00',
        'L''Empreinte, 301 Avenue de l''Europe, Savigny-Le-Temple, France',
        'L''Empreinte',
        'Musique',
        'https://photos.bandsintown.com/thumb/19271463.jpeg'
    );

-- Simon McBride @ Backstage By The Mill
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Simon McBride en concert',
        'Simon McBride, guitariste de Deep Purple, présente son répertoire blues-rock. Virtuose de la guitare, il a tourné avec Joe Satriani, Jeff Beck et Joe Bonamassa.',
        '2025-05-28 20:00:00',
        'Backstage By The Mill, 92 Boulevard de Clichy, Paris, France',
        'Backstage By The Mill',
        'Musique',
        'https://photos.bandsintown.com/thumb/9714442.jpeg'
    );

-- A2H @ MJC de la Vallée
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'A2H en concert',
        'A2H se produira au 25 de la Vallée avec Tracy De Sà en première partie. Une soirée de musique actuelle et engagée.',
        '2025-06-01 20:00:00',
        'MJC de la Vallée, 25 Rue des Fontaines Marivel, Chaville, France',
        'MJC de la Vallée',
        'Musique',
        'https://photos.bandsintown.com/thumb/19059245.jpeg'
    );

-- Nadim @ Le Métropole
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Nadim en concert',
        'Nadim, artiste aux influences variées, présente son nouveau spectacle au Métropole. Un mélange de chanson française et de world music.',
        '2025-06-05 20:10:00',
        'Le Métropole, 39, rue du Sentier, Paris, France',
        'Le Métropole',
        'Musique',
        'https://photos.bandsintown.com/thumb/288359.jpeg'
    );

-- Ben l''Oncle Soul @ Espace Lumière
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Ben l''Oncle Soul en concert',
        'Ben l''Oncle Soul revient avec son mélange unique de soul, de funk et de pop. Une voix puissante et des mélodies entraînantes pour une soirée mémorable.',
        '2025-06-08 20:30:00',
        'Espace Lumière, 6 Avenue de Lattre de Tassigny, Épinay-sur-Seine, France',
        'Espace Lumière',
        'Musique',
        'https://photos.bandsintown.com/thumb/19946307.jpeg'
    );

-- Ensemble Musicâme France @ Église de Saint Germain des Prés
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Rêverie parisienne : Debussy, Ravel, Bizet, Rameau, Fauré, Chaminade',
        'Un voyage musical captivant avec les chefs-d''œuvre de Rameau, Debussy, Ravel, Bizet, Saint-Saëns et Devienne. Une soirée d''élégance et d''émotion au cœur de la capitale.',
        '2025-06-12 20:30:00',
        'Église de Saint Germain des Prés, 3 Place St-Germain-des-Prés, Paris, France',
        'Ensemble Musicâme France',
        'Classique',
        'https://photos.bandsintown.com/thumb/20737827.jpeg'
    );

-- The Buttshakers @ salle des fêtes de Néron
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'The Buttshakers - Jazz de Mars',
        'The Buttshakers, groupe de jazz énergique, apporte son swing caractéristique à la salle des fêtes de Néron pour une soirée festive.',
        '2025-06-15 20:30:00',
        'salle des fêtes de Néron, 108 Av. Maurice Maunoury, Luisant, France',
        'Jazz de Mars',
        'Jazz',
        'https://photos.bandsintown.com/thumb/8982555.jpeg'
    );

-- Ÿuma @ Be Jazzy
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Ÿuma en concert',
        'Ÿuma, artiste émergente de la scène jazz contemporaine, présente son répertoire intimiste dans l''ambiance chaleureuse de Be Jazzy.',
        '2025-06-18 20:00:00',
        'Be Jazzy, 12 av de la porte de Montmartre, Paris 18 Buttes-montmartre, France',
        'Be Jazzy',
        'Jazz',
        'https://photos.bandsintown.com/thumb/20567235.jpeg'
    );

-- The Cinelli Brothers @ Festival Jazz à toute Heure
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'The Cinelli Brothers live @ Festival Jazz à toute Heure',
        'Les frères Cinelli apportent leur blues énergique au festival Jazz à toute Heure. Un mélange de tradition et de modernité pour les amateurs de blues authentique.',
        '2025-06-20 20:00:00',
        'Festival Jazz à toute Heure, Rochefort-en-yvelines, France',
        'Festival Jazz à toute Heure',
        'Jazz',
        'https://photos.bandsintown.com/thumb/19758956.jpeg'
    );

-- Photøgraph @ Studios 240
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Photøgraph en concert',
        'Photøgraph, projet musical expérimental, présente son univers sonore unique mêlant électronique et instruments acoustiques dans les Studios 240.',
        '2025-06-22 20:30:00',
        'Studios 240, 94 Rue de Saint-Germain, Cormeilles-en-Parisis, France',
        'Studios 240',
        'Electronique',
        'https://photos.bandsintown.com/thumb/20678234.jpeg'
    );

-- Red Beans and Pepper Sauce @ Espace Florence Leblond
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Red Beans and Pepper Sauce',
        'Red Beans and Pepper Sauce, groupe de jazz Nouvelle-Orléans, apporte son énergie communicative à l''Espace Florence Leblond pour une soirée festive et dansante.',
        '2025-06-25 20:30:00',
        'Espace Florence Leblond, 91310 Leuville-sur-Orge, Leuville-sur-Orge, France',
        'Espace Florence Leblond',
        'Jazz',
        'https://photos.bandsintown.com/thumb/14224068.jpeg'
    );

-- Didier Gustin @ Saint Exupéry Space
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Didier Gustin : Johnny libre dans ma tête',
        'Didier Gustin rend hommage à Johnny Hallyday dans ce spectacle émouvant qui retrace la carrière du taulier du rock français à travers ses plus grands titres.',
        '2025-06-28 20:30:00',
        'Saint Exupéry Space, 1 place rené iametti, Wissous, France',
        'Saint Exupéry Space',
        'Musique',
        'https://photos.bandsintown.com/thumb/20556224.jpeg'
    );

-- DJ Mad Dog @ Le Nexus
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'DJ Mad Dog au Nexus',
        'DJ Mad Dog, figure de la scène hardcore, prend les commandes du Nexus pour une nuit de son puissant et de beats implacables.',
        '2025-07-02 22:30:00',
        'Le Nexus, 100 Avenue du Général Leclerc, Pantin, France',
        'Le Nexus',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/8408875.jpeg'
    );

-- HanniBaSs @ DISSIDANCE
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Dissidance présente HanniBaSs',
        'Soirée techno avec HanniBaSs et une line-up explosive: UNFACED, SIX OU SEPT, NEKO, LOWEL B2B FLAME, REZHU. Scénographie avec VJing en live sur écran LED de 8 mètres.',
        '2025-07-05 22:00:00',
        'DISSIDANCE, 14 Rue Saint-Merri, Paris, France',
        'DISSIDANCE',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/6247962.jpeg'
    );

-- Jolly @ La Gare / Le Gore
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Jolly à La Gare / Le Gore',
        'Jolly, collectif musical éclectique, clôturera la nuit avec un set énergique mêlant influences électroniques et world music dans l''ambiance unique de La Gare / Le Gore.',
        '2025-07-08 23:59:00',
        'La Gare / Le Gore, 1 Av. Corentin Cariou, Paris, France',
        'La Gare / Le Gore',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/6247962.jpeg'
    );

-- Pop Fiction @ Apollo Théâtre
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Pop Fiction - Film improvisé',
        'N''allez pas au cinéma, on a trouvé mieux! Venez voir un film improvisé... Au Théâtre! Le public choisit les éléments du film qui sera joué une seule et unique fois.',
        '2025-07-10 18:00:00',
        'Apollo Théâtre, 18 Rue du Faubourg du Temple, Paris, France',
        'Apollo Théâtre',
        'Théâtre',
        'https://photos.bandsintown.com/thumb/8499721.jpeg'
    );

-- REAVEN @ Les Agla''scènes
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'REAVEN aux Agla''scènes',
        'REAVEN, groupe de rock progressif, présente son nouveau spectacle dans le cadre du festival Les Agla''scènes. Une performance musicale intense et visuelle.',
        '2025-07-12 17:30:00',
        'Les Agla''scènes, 1 Rue des Écoles, Égly, France',
        'Les Agla''scènes',
        'Musique',
        'https://photos.bandsintown.com/thumb/20804638.jpeg'
    );

-- Eli Waltz @ El Zókalo
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Eli Waltz : Fairytales & Ghosts Tour',
        'Korina and Eli kick off the Fairytales & Ghosts Tour at Korina''s home base, Paris. Une soirée intimiste mêlant folk et chanson à texte.',
        '2025-07-15 19:30:00',
        'El Zókalo, 49 Rue Pixérécourt, Paris, France',
        'El Zókalo',
        'Musique',
        'https://photos.bandsintown.com/thumb/20107300.jpeg'
    );

-- Emajeur @ Conservatory De Vanves
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Emajeur - Tremplin SO JAM Demi-Finale',
        'Demi-finale du tremplin SO JAM avec Emajeur et d''autres talents émergents de la scène musicale. Venez découvrir les futurs talents du rock français.',
        '2025-07-18 19:30:00',
        'Conservatory De Vanves, 17-21 Rue Solférino, Vanves, France',
        'Conservatory De Vanves',
        'Musique',
        'https://photos.bandsintown.com/thumb/20849490.jpeg'
    );

-- Kazam @ Grand Marché Stalingrad
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Kazam à Solarium',
        'Soirée Solarium avec Kazam, Paul Cut, Lüma-G et d''autres artistes sur 3 espaces différents. Une nuit de musique électronique jusqu''au petit matin.',
        '2025-07-20 22:00:00',
        'Grand Marché Stalingrad - La Rotonde, 6-8 Place de la Bataille de Stalingrad, Paris, France',
        'Solarium',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/7255526.jpeg'
    );

-- DJ Suspect @ Sacré
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'DJ Suspect au Sacré',
        'Soirée clubbing au Sacré avec DJ Suspect en DiscoBar et Deborah Aime La Bagarre + secret guest en Club. Une nuit de musique et de danse dans ce lieu mythique.',
        '2025-07-22 23:00:00',
        'Sacré, 142 rue Montmartre, Paris, France',
        'Sacré',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/228048.jpeg'
    );

-- Tatie Dee @ Badaboum
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Tatie Dee au Badaboum',
        'Tatie Dee, DJ incontournable de la scène house française, prend les commandes du Badaboum pour une nuit de grooves entraînants et de beats énergiques.',
        '2025-07-25 23:30:00',
        'Badaboum, 2 Rue des Taillandiers, Paris, France',
        'Badaboum',
        'Clubbing',
        'https://photos.bandsintown.com/thumb/20609308.jpeg'
    );

-- Thomas Naïm Solo @ Auditorium Rostropovitch
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Thomas Naïm Solo - Festival Blues Autour du Zinc',
        'Thomas Naïm revisite le monde foisonnant de Jimi Hendrix, en solo, à la guitare acoustique. Naviguant entre minimalisme et transe, évidence mélodique et fulgurances rythmiques.',
        '2025-04-10 20:00:00',
        'Auditorium Rostropovitch, Cour de la Musique, Beauvais, France',
        'Festival Blues Autour du Zinc',
        'Musique',
        'https://photos.bandsintown.com/thumb/8700259.jpeg'
    );

-- Nirvana UK @ Zenith Paris
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Nirvana UK - Hommage à Nirvana',
        'Nirvana UK, le meilleur tribute band de Nirvana, rend hommage au groupe légendaire avec une reproduction fidèle des plus grands titres et de l''énergie live de Kurt Cobain et ses acolytes.',
        '2025-04-08 20:00:00',
        'Zenith Paris - La Villette, 211 Avenue Jean Jaurès, Paris, France',
        'Zenith Paris',
        'Musique',
        'https://photos.bandsintown.com/thumb/16937295.jpeg'
    );

-- Durand Jones & The Indications @ Théâtre Equestre Zingaro
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Durand Jones & The Indications',
        'Durand Jones & The Indications sont reconnus autant pour l''énergie débordante de leurs concerts que pour l''alchimie de leurs deux chanteurs et la qualité de leur écriture.',
        '2025-04-05 20:00:00',
        'Théâtre Equestre Zingaro, 176 ave Jean Jaures, Aubervilliers, France',
        'ASTÉRIOS SPECTACLES',
        'Musique',
        'https://photos.bandsintown.com/thumb/9053021.jpeg'
    );

-- Monsieur Lune @ Festival À Tout Bout de Chant
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Monsieur Lune - L''Ascenseur Cosmique',
        'Spectacle jeune public "L''Ascenseur Cosmique" de Monsieur Lune. Une aventure musicale et poétique à travers l''espace pour les petits et les grands.',
        '2025-04-15 14:30:00',
        'Festival À Tout Bout de Chant, Magny-les-hameaux, France',
        'Festival À Tout Bout de Chant',
        'Jeune public',
        'https://photos.bandsintown.com/thumb/12795697.jpeg'
    );

-- Matthieu Souchet @ Bar Gallia
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Matthieu Souchet - Maître Mim''s',
        'Matthieu Souchet présente "Maître Mim''s", son nouveau one-man-show mêlant humour absurde et observations sociales décalées.',
        '2025-04-18 19:00:00',
        'Bar Gallia, 35 Rue Méhul, Pantin, France',
        'Bar Gallia',
        'Humour',
        'https://photos.bandsintown.com/thumb/11005961.jpeg'
    );

-- Grissini Project @ Salle Cortot
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'Grissini Project : Les Plus Belles Musiques des Films de Miyazaki',
        'Quatuor de musiciens passionnés de pop culture, le Grissini project vous interprète les plus belles musiques des films d''animation d''Hayao Miyazaki.',
        '2025-04-20 19:00:00',
        'Salle Cortot, 78 Rue Cardinet, Paris, France',
        'Salle Cortot',
        'Classique',
        'https://assets.prod.bandsintown.com/images/homeIcon/festivalPlaceHolderImage/01.png'
    );

-- Maximum Tour Music @ L''Empreinte
INSERT INTO
    events (
        title,
        descriptions,
        event_datetime,
        locations,
        organizer,
        category,
        imagepath
    )
VALUES
    (
        'LOCOMUERTE - SAVIGNY-LE-TEMPLE (77) - L''Empreinte',
        'L''empreinte de Montcul // Warm up du Plane''R''Fest avec Locomuerte, Vertex et When Reasons Collapse. Une soirée rock énergique pour préparer le festival à venir.',
        '2025-04-22 20:00:00',
        'L''Empreinte, 301 Avenue de l''Europe, Savigny-Le-Temple, France',
        'Maximum Tour Music',
        'Musique',
        'https://photos.bandsintown.com/thumb/19276106.jpeg'
    );

---TICKETS
-- The Cinelli Brothers @ Le Blues Autour du Zinc
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'The Cinelli Brothers live @ Le Blues Autour du Zinc'
        ),
        'Standard',
        25.00,
        100,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'The Cinelli Brothers live @ Le Blues Autour du Zinc'
        ),
        'Premium',
        45.00,
        50,
        2,
        NOW()
    );

-- Bernard (FR) @ Pub Montmartre
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Bernard (FR) en concert'
        ),
        'Standard',
        15.00,
        80,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Bernard (FR) en concert'
        ),
        'Early Bird',
        10.00,
        20,
        2,
        NOW()
    );

-- Rosa Bursztein @ THEATRE DE L'OEUVRE
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Rosa Bursztein : Dédoublée'
        ),
        'Standard',
        30.00,
        150,
        6,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Rosa Bursztein : Dédoublée'
        ),
        'VIP',
        60.00,
        30,
        2,
        NOW()
    );

-- Bermud @ SUPERSONIC
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Bermud en concert'
        ),
        'Standard',
        20.00,
        120,
        4,
        NOW()
    );

-- FENCES + THE INTERSPHERE @ La Boule Noire
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'FENCES + THE INTERSPHERE'
        ),
        'Standard',
        25.00,
        200,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'FENCES + THE INTERSPHERE'
        ),
        'Balcony',
        35.00,
        50,
        2,
        NOW()
    );

-- The Intersphere @ La Boule Noire
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'The Intersphere en concert'
        ),
        'Standard',
        22.00,
        180,
        4,
        NOW()
    );

-- Biga*Ranx @ LA CIGALE
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Biga*Ranx à La Cigale'
        ),
        'Standard',
        35.00,
        300,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Biga*Ranx à La Cigale'
        ),
        'Golden Circle',
        55.00,
        100,
        2,
        NOW()
    );

-- Droges @ FGO-Barbara
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Droges en concert'
        ),
        'Standard',
        18.00,
        90,
        4,
        NOW()
    );

-- Gaffa Tape Sandy @ Le Klub
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Gaffa Tape Sandy'
        ),
        'Standard',
        15.00,
        70,
        4,
        NOW()
    );

-- Gavin James @ LE TRABENDO
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Gavin James en concert'
        ),
        'Standard',
        28.00,
        250,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Gavin James en concert'
        ),
        'Meet & Greet',
        75.00,
        20,
        1,
        NOW()
    );

-- Gad Elmaleh @ Elispace
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Gad Elmaleh : Lui-même'
        ),
        'Standard',
        50.00,
        500,
        6,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Gad Elmaleh : Lui-même'
        ),
        'Premium',
        90.00,
        100,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Gad Elmaleh : Lui-même'
        ),
        'VIP',
        150.00,
        30,
        2,
        NOW()
    );

-- OMED @ Bonnie Club
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'OMED au Bonnie Club'
        ),
        'Standard',
        20.00,
        200,
        4,
        NOW()
    );

-- Stax @ Les Apaches
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Anniversaire DJ Aleathory aux Apaches'
        ),
        'Standard',
        15.00,
        150,
        4,
        NOW()
    );

-- Mae Andrazz @ Protestant Evangelical Church
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Mae Andrazz : Ombre et Lumière'
        ),
        'Standard',
        12.00,
        80,
        4,
        NOW()
    );

-- Meskerem Mees @ MC93
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Meskerem Mees: Rosas - Exit Above'
        ),
        'Standard',
        25.00,
        120,
        4,
        NOW()
    );

-- Locomuerte @ L''Empreinte
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Locomuerte - Warm-Up Plane''r Fest'
        ),
        'Standard',
        18.00,
        200,
        4,
        NOW()
    );

-- Simon McBride @ Backstage By The Mill
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Simon McBride en concert'
        ),
        'Standard',
        30.00,
        150,
        4,
        NOW()
    );

-- A2H @ MJC de la Vallée
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'A2H en concert'
        ),
        'Standard',
        10.00,
        100,
        4,
        NOW()
    );

-- Nadim @ Le Métropole
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Nadim en concert'
        ),
        'Standard',
        22.00,
        120,
        4,
        NOW()
    );

-- Ben l''Oncle Soul @ Espace Lumière
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Ben l''Oncle Soul en concert'
        ),
        'Standard',
        35.00,
        300,
        4,
        NOW()
    );

-- Ensemble Musicâme France @ Église de Saint Germain des Prés
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Rêverie parisienne : Debussy, Ravel, Bizet, Rameau, Fauré, Chaminade'
        ),
        'Standard',
        28.00,
        150,
        4,
        NOW()
    );

-- The Buttshakers @ salle des fêtes de Néron
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'The Buttshakers - Jazz de Mars'
        ),
        'Standard',
        15.00,
        100,
        4,
        NOW()
    );

-- Ÿuma @ Be Jazzy
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Ÿuma en concert'
        ),
        'Standard',
        20.00,
        80,
        4,
        NOW()
    );

-- The Cinelli Brothers @ Festival Jazz à toute Heure
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'The Cinelli Brothers live @ Festival Jazz à toute Heure'
        ),
        'Standard',
        30.00,
        200,
        4,
        NOW()
    );

-- Photøgraph @ Studios 240
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Photøgraph en concert'
        ),
        'Standard',
        15.00,
        70,
        4,
        NOW()
    );

-- Red Beans and Pepper Sauce @ Espace Florence Leblond
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Red Beans and Pepper Sauce'
        ),
        'Standard',
        12.00,
        90,
        4,
        NOW()
    );

-- Didier Gustin @ Saint Exupéry Space
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Didier Gustin : Johnny libre dans ma tête'
        ),
        'Standard',
        35.00,
        250,
        4,
        NOW()
    );

-- DJ Mad Dog @ Le Nexus
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'DJ Mad Dog au Nexus'
        ),
        'Standard',
        20.00,
        300,
        4,
        NOW()
    );

-- HanniBaSs @ DISSIDANCE
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Dissidance présente HanniBaSs'
        ),
        'Standard',
        25.00,
        200,
        4,
        NOW()
    );

-- Jolly @ La Gare / Le Gore
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Jolly à La Gare / Le Gore'
        ),
        'Standard',
        15.00,
        150,
        4,
        NOW()
    );

-- Pop Fiction @ Apollo Théâtre
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Pop Fiction - Film improvisé'
        ),
        'Standard',
        18.00,
        120,
        4,
        NOW()
    );

-- REAVEN @ Les Agla''scènes
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'REAVEN aux Agla''scènes'
        ),
        'Standard',
        15.00,
        100,
        4,
        NOW()
    );

-- Eli Waltz @ El Zókalo
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Eli Waltz : Fairytales & Ghosts Tour'
        ),
        'Standard',
        20.00,
        60,
        4,
        NOW()
    );

-- Emajeur @ Conservatory De Vanves
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Emajeur - Tremplin SO JAM Demi-Finale'
        ),
        'Standard',
        10.00,
        150,
        4,
        NOW()
    );

-- Kazam @ Grand Marché Stalingrad
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Kazam à Solarium'
        ),
        'Standard',
        25.00,
        300,
        4,
        NOW()
    );

-- DJ Suspect @ Sacré
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'DJ Suspect au Sacré'
        ),
        'Standard',
        20.00,
        200,
        4,
        NOW()
    );

-- Tatie Dee @ Badaboum
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Tatie Dee au Badaboum'
        ),
        'Standard',
        15.00,
        150,
        4,
        NOW()
    );

-- Thomas Naïm Solo @ Auditorium Rostropovitch
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Thomas Naïm Solo - Festival Blues Autour du Zinc'
        ),
        'Standard',
        25.00,
        120,
        4,
        NOW()
    );

-- Nirvana UK @ Zenith Paris
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Nirvana UK - Hommage à Nirvana'
        ),
        'Standard',
        40.00,
        500,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Nirvana UK - Hommage à Nirvana'
        ),
        'Golden Circle',
        65.00,
        200,
        2,
        NOW()
    );

-- Durand Jones & The Indications @ Théâtre Equestre Zingaro
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Durand Jones & The Indications'
        ),
        'Standard',
        35.00,
        300,
        4,
        NOW()
    );

-- Monsieur Lune @ Festival À Tout Bout de Chant
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Monsieur Lune - L''Ascenseur Cosmique'
        ),
        'Child',
        8.00,
        100,
        4,
        NOW()
    ),
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Monsieur Lune - L''Ascenseur Cosmique'
        ),
        'Adult',
        12.00,
        100,
        4,
        NOW()
    );

-- Matthieu Souchet @ Bar Gallia
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Matthieu Souchet - Maître Mim''s'
        ),
        'Standard',
        15.00,
        50,
        4,
        NOW()
    );

-- Grissini Project @ Salle Cortot
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'Grissini Project : Les Plus Belles Musiques des Films de Miyazaki'
        ),
        'Standard',
        30.00,
        150,
        4,
        NOW()
    );

-- Maximum Tour Music @ L''Empreinte
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
    (
        (
            SELECT
                event_id
            FROM
                events
            WHERE
                title = 'LOCOMUERTE - SAVIGNY-LE-TEMPLE (77) - L''Empreinte'
        ),
        'Standard',
        20.00,
        200,
        4,
        NOW()
    );

-----INSERT FOR ORDER -------------
-- Récupérer les informations actuelles
SELECT
    oi.quantity as old_quantity,
    oi.price,
    oi.ticket_id,
    t.available
FROM
    order_items oi
    JOIN tickets t ON oi.ticket_id = t.ticket_id
WHERE
    oi.order_item_id = $ 1 FOR
UPDATE
;

-- Calculer la différence de quantité
-- Mettre à jour l'article
UPDATE
    order_items
SET
    quantity = $ 2
WHERE
    order_item_id = $ 1;

-- Mettre à jour la disponibilité du ticket
UPDATE
    tickets
SET
    available = available + ($ 3 - $ 2)
WHERE
    ticket_id = $ 4;

-- Mettre à jour le total de la commande
UPDATE
    orders
SET
    total_amount = total_amount + (($ 2 - $ 3) * $ 5)
WHERE
    order_id = $ 6;

COMMIT;

-- Order 1 for user1 (a2a7ab5d-08de-40a6-a264-7cf54bd99f5e)
INSERT INTO
    orders (user_id, total_amount)
VALUES
    ('a2a7ab5d-08de-40a6-a264-7cf54bd99f5e', 270.00);

-- Order items for order 1 (assuming some tickets exist)
-- VIP ticket for event d8344a6b-7cf4-43bb-9a0e-b07bc5bd9ff4 (1 ticket)
INSERT INTO
    order_items (order_id, ticket_id, quantity, price)
VALUES
    (
        'd7817f40-88f0-48dc-aa93-31534bc34db3',
        '9dfff25d-05d8-4744-896f-da1ba561c50a',
        1,
        200.00
    );

-- Early Bird ticket for event db42b716-fb48-4726-a09f-f3bd3be422e7 (1 ticket)
INSERT INTO
    order_items (order_id, ticket_id, quantity, price)
VALUES
    (
        'd7817f40-88f0-48dc-aa93-31534bc34db3',
        '00e0eda7-1d9d-4111-a2d6-d31bbb0f3fc0',
        1,
        70.00
    );

---Order 2 for user2 (0165f456-6e80-4c81-a170-90408a832f0a)
INSERT INTO
    orders (user_id, total_amount)
VALUES
    ('0165f456-6e80-4c81-a170-90408a832f0a', 175.00);

-- Standard ticket for event 9d515b65-4cac-4400-913d-3c28772752e7 (2 tickets)
INSERT INTO
    order_items (order_id, ticket_id, quantity, price)
VALUES
    (
        'bd5c3efb-899f-4a63-b108-a6aba992c0d5',
        'f98cb3ce-a230-4029-bdc3-d348011f7e9b',
        2,
        25.00
    );

-- Early Bird ticket for event ea5af19b-7e93-43a1-86d9-40b3466e2b6b (1 ticket)
INSERT INTO
    order_items (order_id, ticket_id, quantity, price)
VALUES
    (
        'bd5c3efb-899f-4a63-b108-a6aba992c0d5',
        'bdb01ceb-50a3-404e-9c82-efdfd03cf1f4',
        1,
        40.00
    );

-- Participation ticket for event 6d05d771-64b4-4475-8650-be70a1aa6935 (3 tickets)
INSERT INTO
    order_items (order_id, ticket_id, quantity, price)
VALUES
    (
        'bd5c3efb-899f-4a63-b108-a6aba992c0d5',
        '54e4f8e0-ba85-4b8f-b7f8-c8d2de8c6c44',
        3,
        20.00
    );

-- View order details with items
SELECT
    o.order_id,
    u.user_name,
    e.title,
    t.types,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS item_total
FROM
    order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN users u ON o.user_id = u.user_id
    LEFT JOIN tickets t ON oi.ticket_id = t.ticket_id
    LEFT JOIN events e ON t.event_id = e.event_id;

WHERE
    u.user_id = 'a2a7ab5d-08de-40a6-a264-7cf54bd99f5e';