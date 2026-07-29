-- Run this once to add password-reset columns to the users table
ALTER TABLE users
  ADD COLUMN reset_token VARCHAR(64) DEFAULT NULL,
  ADD COLUMN reset_token_expires DATETIME DEFAULT NULL;
