CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    CHECK (position('@' IN email) > 1),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE parks (
    code VARCHAR(100) PRIMARY KEY,
    name TEXT NOT NULL,
    longitude NUMERIC NOT NULL,
    latitude NUMERIC NOT NULL,
    park_type VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL
);

CREATE TABLE parks_activities (
    id SERIAL PRIMARY KEY,
    park_code VARCHAR(100) NOT NULL REFERENCES parks ON DELETE CASCADE,
    activity TEXT NOT NULL
);

CREATE TABLE users_parks (
    username VARCHAR(25) NOT NULL REFERENCES users ON DELETE CASCADE,
    park_code VARCHAR(100) NOT NULL REFERENCES parks ON DELETE CASCADE,
    visited BOOLEAN NOT NULL DEFAULT FALSE,
    park_notes TEXT,
    PRIMARY KEY (username, park_code)
);

CREATE TABLE users_routes (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL REFERENCES users ON DELETE CASCADE,
    route_name VARCHAR(100) NOT NULL,
    route_notes TEXT,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes_details (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES users_routes ON DELETE CASCADE,
    seq_number INTEGER NOT NULL,
    waypoint_name TEXT NOT NULL,
    waypoint_longitude NUMERIC NOT NULL,
    waypoint_latitude NUMERIC NOT NULL,
    park_flag BOOLEAN NOT NULL,
    park_code VARCHAR(100)
);

