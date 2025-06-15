-- consultas sql para crear la BD

CREATE DATABASE medical;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR (40),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW () 
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR (40),
    age INT,
    
)