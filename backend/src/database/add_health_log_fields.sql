-- ============================================================
-- Migration: Extend health_logs for full Add Health Log form
-- Run ONCE after schema.sql + add_resident_fields.sql
-- ============================================================
USE familycare_db;

ALTER TABLE health_logs
  ADD COLUMN breakfast_status   ENUM('Completed','Skipped','Pending') DEFAULT 'Pending',
  ADD COLUMN lunch_status       ENUM('Completed','Skipped','Pending') DEFAULT 'Pending',
  ADD COLUMN dinner_status      ENUM('Completed','Skipped','Pending') DEFAULT 'Pending',
  ADD COLUMN meds_taken         TINYINT(1)   DEFAULT NULL,
  ADD COLUMN meds_notes         TEXT         DEFAULT NULL,
  ADD COLUMN clinical_notes     TEXT         DEFAULT NULL,
  ADD COLUMN mood               VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN overall_condition  ENUM('STABLE','NEEDS ATTENTION','CRITICAL') DEFAULT 'STABLE',
  ADD COLUMN attachment_url     VARCHAR(255) DEFAULT NULL;