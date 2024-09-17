-- Add up migration script here
CREATE TABLE IF NOT EXISTS users (
	id int NOT NULL,
	username varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);
