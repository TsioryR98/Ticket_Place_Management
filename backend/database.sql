CREATE DATABASE ticket_management;
\c ticket_management;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), /*dafault generate*/
    user_name VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_passwords TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user' CHECK ("role" IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT NOW()

);

INSERT INTO users (username, email, passwords, passwords,"role", created_at) VALUES ($1,$2,$3,$4,$5);

INSERT INTO users (user_name, user_email, user_passwords, "role", created_at) VALUES 
('admin_user', 'admin@example.com', 'hashedpassword1', 'admin', NOW());

INSERT INTO users (user_name, user_email, user_passwords, created_at) 
VALUES ('regular_user', 'user@example.com', 'hashedpassword2', NOW());

INSERT INTO users (user_name, user_email, user_passwords) 
VALUES ('regular_user', 'user@example.com', 'hashedpassword2');
