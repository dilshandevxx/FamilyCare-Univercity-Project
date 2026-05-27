-- Add Two-Factor Authentication columns to users table
ALTER TABLE users
  ADD COLUMN tfa_secret VARCHAR(255) DEFAULT NULL,
  ADD COLUMN tfa_enabled TINYINT(1) DEFAULT 0 NOT NULL;