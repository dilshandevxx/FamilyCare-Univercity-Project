require('dotenv').config({ path: '../../.env' });
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('Seeding Mock Data for Admin V2 Testing...');
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    // 1. Create a Family Member
    const [userRes1] = await pool.query(
      `INSERT IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)`,
      ['John Smith', 'john@example.com', hash, '555-0101', 'child']
    );
    let childId = userRes1.insertId;
    if (childId === 0) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', ['john@example.com']);
      childId = rows[0].id;
    }

    // 2. Create a Caregiver
    const [userRes2] = await pool.query(
      `INSERT IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)`,
      ['Mary Jenkins', 'mary.care@example.com', hash, '555-0102', 'caregiver']
    );
    let caregiverUserId = userRes2.insertId;
    if (caregiverUserId === 0) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', ['mary.care@example.com']);
      caregiverUserId = rows[0].id;
    }

    // Add Caregiver details
    const [cgRes] = await pool.query(
      `INSERT IGNORE INTO caregivers (user_id, name, specialization, experience_years, is_available) VALUES (?, ?, ?, ?, ?)`,
      [caregiverUserId, 'Mary Jenkins', 'Senior Care Specialist', '8', 1]
    );
    let caregiverId = cgRes.insertId;
    if (caregiverId === 0) {
      const [rows] = await pool.query('SELECT id FROM caregivers WHERE user_id = ?', [caregiverUserId]);
      caregiverId = rows[0].id;
    }

    // 3. Create a pending caregiver (for Caregiver Approval)
    const [userRes3] = await pool.query(
      `INSERT IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)`,
      ['Peter Pending', 'peter.p@example.com', hash, '555-0103', 'caregiver']
    );
    let pendingUserId = userRes3.insertId;
    if (pendingUserId === 0) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', ['peter.p@example.com']);
      pendingUserId = rows[0].id;
    }
    
    await pool.query(
      `INSERT IGNORE INTO caregivers (user_id, name, specialization, is_available) VALUES (?, ?, ?, ?)`,
      [pendingUserId, 'Peter Pending', 'Physical Therapy', 0] // 0 means not yet approved in this context or they just have no active tasks
    );

    // 4. Create an Elder (Parent) assigned to Caregiver Mary
    const [elderRes] = await pool.query(
      `INSERT IGNORE INTO parents (child_id, name, age, gender, relationship, medical_conditions, room_number, care_status, assigned_caregiver_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [childId, 'Arthur Jenkins', 78, 'Male', 'Father', 'Hypertension, Mild Dementia', '101A', 'STABLE', caregiverId]
    );
    let elderId = elderRes.insertId;
    if (elderId === 0) {
      const [rows] = await pool.query('SELECT id FROM parents WHERE name = ?', ['Arthur Jenkins']);
      elderId = rows[0].id;
    }

    // Add additional Elders for Elder Management view
    await pool.query(
      `INSERT IGNORE INTO parents (child_id, name, age, gender, relationship, medical_conditions, room_number, care_status, assigned_caregiver_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [childId, 'Martha Sterling', 82, 'Female', 'Mother', 'Arthritis, Osteoporosis', '102B', 'STABLE', caregiverId]
    );

    await pool.query(
      `INSERT IGNORE INTO parents (child_id, name, age, gender, relationship, medical_conditions, room_number, care_status, assigned_caregiver_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [childId, 'George Cooper', 75, 'Male', 'Uncle', 'Diabetes Type 2', '204A', 'NEEDS_ATTENTION', caregiverId]
    );

    await pool.query(
      `INSERT IGNORE INTO parents (child_id, name, age, gender, relationship, medical_conditions, room_number, care_status, assigned_caregiver_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [childId, 'Eleanor Vance', 88, 'Female', 'Grandmother', 'Severe Dementia, Heart Failure', '305C', 'CRITICAL', null]
    );

    // 5. Create Health Logs
    await pool.query(`DELETE FROM health_logs WHERE parent_id = ?`, [elderId]);
    await pool.query(
      `INSERT INTO health_logs (parent_id, blood_pressure, heart_rate, temperature, notes, logged_by) VALUES 
       (?, '120/80', 72, 98.6, 'Patient resting comfortably.', ?),
       (?, '130/85', 80, 99.1, 'Slightly elevated BP. Monitoring closely.', ?),
       (?, '150/95', 102, 101.4, 'CRITICAL: High fever and rapid heart rate.', ?)`
    , [elderId, caregiverUserId, elderId, caregiverUserId, elderId, caregiverUserId]);

    // 6. Create Alerts
    await pool.query(`DELETE FROM alerts WHERE parent_id = ?`, [elderId]);
    await pool.query(
      `INSERT INTO alerts (parent_id, title, description, type, is_resolved) VALUES 
       (?, 'Fever Detected', 'Arthur Jenkins temperature recorded at 101.4 F.', 'warning', false),
       (?, 'Missed Medication', 'Morning heart medication was not logged by 9:00 AM.', 'critical', false),
       (?, 'Routine Checkup Due', 'Monthly routine health checkup is due in 3 days.', 'info', false)`
    , [elderId, elderId, elderId]);

    console.log('Mock Data Inserted Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error Seeding Mock Data:', error);
    process.exit(1);
  }
};

seedData();
