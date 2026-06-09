-- ============================================================
-- Seed Data for Testing
-- Run AFTER schema.sql and all migrations
-- ============================================================
USE familycare_db;

-- NOTE: Replace 1 with your actual caregiver's user_id (check users table after registering)
-- Example: INSERT into parents with assigned_caregiver_id = 1 means caregiver id=1 is assigned

-- First, make sure a family user exists (id=1 for demo — update if different)
-- Insert sample residents assigned to caregiver with id=1
-- (assigned_caregiver_id refers to caregivers.id, NOT users.id)

INSERT INTO parents (child_id, name, age, medical_conditions, room_number, care_status, assigned_caregiver_id)
VALUES
  (1, 'Eleanor Vance',   82, 'Hypertension, Type 2 DM',     '402', 'MODERATE CARE', 1),
  (1, 'Robert Sterling', 78, 'Post-Stroke Recovery',          '215', 'STABLE',        1),
  (1, 'Clara Oswald',    74, 'Type 2 Diabetes',               '318', 'NEEDS ATTENTION',1),
  (1, 'Arthur Jenkins',  80, 'Congestive Heart Failure',      '101', 'CRITICAL',       1);

-- Sample health logs
INSERT INTO health_logs (parent_id, blood_pressure, heart_rate, temperature, meal_status, notes, logged_by)
VALUES
  (1, '158/95', 98,  99.1, 'Full',    'Morning check – elevated BP noted',  1),
  (2, '120/80', 72,  98.4, 'Partial', 'Stable, ate half breakfast',         1),
  (3, '132/84', 78,  98.6, 'Full',    'Normal readings',                    1),
  (4, '145/92', 104, 99.3, 'None',    'Refused breakfast, needs monitoring',1);
