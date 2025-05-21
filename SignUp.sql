CREATE DATABASE userdb;
USE userdb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    profile_image VARCHAR(255),  -- Store image file path or URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

show databases;