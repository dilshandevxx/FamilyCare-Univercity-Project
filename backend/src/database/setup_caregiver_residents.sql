-- ============================================================
-- Quick Setup: Link Ravi's account to caregivers table
-- and assign sample residents
-- Run this in MySQL Workbench or any MySQL client
-- ============================================================
USE familycare_db;

-- ── STEP 1: Show all caregiver users (find Ravi's user id) ───
SELECT id, name, email, role FROM users WHERE role = 'caregiver';

-- ── STEP 2: Create caregivers row for ALL caregiver users
--           that are missing one (safe to run multiple times)
INSERT IGNORE INTO caregivers (user_id, name)
SELECT id, name FROM users
WHERE role = 'caregiver'
  AND id NOT IN (SELECT user_id FROM caregivers WHERE user_id IS NOT NULL);

-- ── STEP 3: Confirm caregivers rows now exist ────────────────
SELECT c.id AS caregiver_id, c.name, u.email
FROM caregivers c
JOIN users u ON u.id = c.user_id;

-- ── STEP 4: Assign ALL existing residents to Ravi ────────────
--   (this finds Ravi's caregivers.id automatically)
UPDATE parents
SET assigned_caregiver_id = (
  SELECT c.id FROM caregivers c
  JOIN users u ON u.id = c.user_id
  WHERE u.name = 'Ravi'
  LIMIT 1
)
WHERE assigned_caregiver_id IS NULL
   OR assigned_caregiver_id NOT IN (SELECT id FROM caregivers);

-- ── STEP 5: If parents table is EMPTY — add sample residents ─
--   (only inserts if table is empty)
INSERT INTO parents (child_id, name, age, medical_conditions, room_number, care_status, assigned_caregiver_id)
SELECT
  (SELECT id FROM users WHERE role = 'caregiver' LIMIT 1),
  v.name, v.age, v.conditions, v.room, v.status,
  (SELECT c.id FROM caregivers c JOIN users u ON u.id = c.user_id WHERE u.name = 'Ravi' LIMIT 1)
FROM (
  SELECT 'Eleanor Vance'   AS name, 82 AS age, 'Hypertension, Type 2 DM'    AS conditions, '402' AS room, 'STABLE'          AS status
  UNION ALL
  SELECT 'Robert Sterling',        78,          'Post-Stroke Recovery',                    '215',         'STABLE'
  UNION ALL
  SELECT 'Clara Oswald',           74,          'Type 2 Diabetes',                         '318',         'NEEDS ATTENTION'
  UNION ALL
  SELECT 'Arthur Jenkins',         80,          'Congestive Heart Failure',                '101',         'CRITICAL'
) v
WHERE (SELECT COUNT(*) FROM parents) = 0;

-- ── STEP 6: Confirm final state ──────────────────────────────
SELECT
  p.id, p.name AS resident, p.room_number, p.care_status,
  c.name AS caregiver, u.email AS caregiver_email
FROM parents p
LEFT JOIN caregivers c ON c.id = p.assigned_caregiver_id
LEFT JOIN users u      ON u.id = c.user_id
ORDER BY p.name;
