require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
  console.log('--- RUNNING CAREGIVER CAPACITY & REQUEST STATUS MIGRATION ---');

  try {
    // 1. Check parents columns
    const [parentCols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'parents'"
    );
    const parentColNames = parentCols.map(c => c.COLUMN_NAME);

    if (!parentColNames.includes('assignment_status')) {
      console.log("Adding 'assignment_status' to parents table...");
      await pool.query(
        "ALTER TABLE parents ADD COLUMN assignment_status ENUM('pending', 'accepted', 'rejected') DEFAULT 'accepted'"
      );
      // Mark existing records with an assigned caregiver as 'accepted'
      await pool.query(
        "UPDATE parents SET assignment_status = 'accepted' WHERE assigned_caregiver_id IS NOT NULL"
      );
    } else {
      console.log("'assignment_status' already exists in parents table.");
    }

    if (!parentColNames.includes('rejection_reason')) {
      console.log("Adding 'rejection_reason' to parents table...");
      await pool.query(
        "ALTER TABLE parents ADD COLUMN rejection_reason VARCHAR(255) NULL"
      );
    } else {
      console.log("'rejection_reason' already exists in parents table.");
    }

    // 2. Check caregivers columns
    const [caregiverCols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'caregivers'"
    );
    const caregiverColNames = caregiverCols.map(c => c.COLUMN_NAME);

    if (!caregiverColNames.includes('max_capacity')) {
      console.log("Adding 'max_capacity' to caregivers table...");
      await pool.query(
        "ALTER TABLE caregivers ADD COLUMN max_capacity INT DEFAULT 4"
      );
    } else {
      console.log("'max_capacity' already exists in caregivers table.");
    }

    console.log('✅ MIGRATION COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MIGRATION ERROR:', err);
    process.exit(1);
  }
}

migrate();
