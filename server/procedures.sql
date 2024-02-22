CREATE TABLE users(
    id serial primary key,
    email varchar(255) unique,
    name varchar(255),
    password varchar(128),
    token varchar(255)
);