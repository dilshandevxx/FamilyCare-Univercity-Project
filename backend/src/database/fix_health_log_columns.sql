-- ============================================================
-- Migration: Fix health_logs column issues
-- 1. Widen temperature to DECIMAL(5,2) for values like 102.50
-- 2. Widen attachment_url to TEXT for long Cloudinary URLs
-- Run ONCE on your database (safe if run more than once due to MODIFY COLUMN)
-- ============================================================
USE familycare_db;

ALTER TABLE health_logs
  MODIFY COLUMN temperature    DECIMAL(5, 2) DEFAULT NULL,
  MODIFY COLUMN attachment_url TEXT          DEFAULT NULL;
