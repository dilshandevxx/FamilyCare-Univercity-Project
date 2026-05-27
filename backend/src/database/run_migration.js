/**
 * run_migration.js
 * Usage:  node src/database/run_migration.js
 * Safely adds tfa_secret and tfa_enabled columns to the users table.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const pool = require('../config/db');

async function addColumnIfMissing(columnName, columnDef) {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
    [columnName]
  );
  if (rows.length === 0) {
    await pool.query(`ALTER TABLE users ADD COLUMN ${columnName} ${columnDef}`);
    console.log(`  ✅  Added column: ${columnName}`);
  } else {
    console.log(`  ℹ️   Column already exists: ${columnName}`);
  }
}

(async () => {
  try {
    console.log('Running 2FA migration…');
    await addColumnIfMissing('tfa_secret',  'VARCHAR(255) DEFAULT NULL');
    await addColumnIfMissing('tfa_enabled', 'TINYINT(1)  DEFAULT 0');
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    process.exit();
  }
})();
