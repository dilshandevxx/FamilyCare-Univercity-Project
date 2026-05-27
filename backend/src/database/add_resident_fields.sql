-- ============================================================
-- Migration: Add resident assignment + care fields
-- Run ONCE after schema.sql
-- ============================================================
USE familycare_db;

-- Add room, care status, and caregiver assignment to parents
ALTER TABLE parents
  ADD COLUMN room_number         VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN care_status        VARCHAR(30)  DEFAULT 'STABLE',
  ADD COLUMN assigned_caregiver_id INT          DEFAULT NULL;

-- Add meal_status to health_logs
ALTER TABLE health_logs
  ADD COLUMN meal_status VARCHAR(20) DEFAULT NULL;