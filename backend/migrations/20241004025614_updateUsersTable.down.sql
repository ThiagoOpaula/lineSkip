-- Add down migration script here
Alter Table users
  Drop Column email,
  Drop Column "password";