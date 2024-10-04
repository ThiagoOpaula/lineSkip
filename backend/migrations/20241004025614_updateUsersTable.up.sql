-- Add up migration script here
ALTER TABLE users 
  ADD COLUMN email varchar NULL,
  ADD COLUMN "password" varchar NULL;
