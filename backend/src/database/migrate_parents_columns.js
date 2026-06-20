/**
 * migrate_parents_columns.js
 * Usage:  node src/database/migrate_parents_columns.js
 * Safely adds missing profile columns to the parents table
 * (gender, relationship, phone, emergency contact, allergies, current_medications).
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const pool = require('../config/db');

async function addColumnIfMissing(columnName, columnDef) {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'parents' AND COLUMN_NAME = ?`,
    [columnName]
  );
  if (rows.length === 0) {
    await pool.query(`ALTER TABLE parents ADD COLUMN ${columnName} ${columnDef}`);
    console.log(`  ✅  Added column: ${columnName}`);
  } else {
    console.log(`  ℹ️   Column already exists: ${columnName}`);
  }
}

(async () => {
  try {
    console.log('Running parents table migration…');
    await addColumnIfMissing('gender', 'VARCHAR(10) AFTER age');
    await addColumnIfMissing('relationship', 'VARCHAR(50) AFTER gender');
    await addColumnIfMissing('phone', 'VARCHAR(20) AFTER relationship');
    await addColumnIfMissing('emergency_contact_name', 'VARCHAR(150) AFTER address');
    await addColumnIfMissing('emergency_contact_phone', 'VARCHAR(20) AFTER emergency_contact_name');
    await addColumnIfMissing('allergies', 'TEXT AFTER medical_conditions');
    await addColumnIfMissing('current_medications', 'TEXT AFTER allergies');
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    process.exit();
  }
})();
