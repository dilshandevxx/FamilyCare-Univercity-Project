require('dotenv').config();
const pool = require('./config/db');

async function debug() {
  console.log('=== DEBUG CAREGIVERS IN DATABASE ===');
  try {
    const [users] = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE role = 'caregiver'");
    console.log(`\nUsers with role='caregiver' (Total: ${users.length}):`);
    console.table(users);

    const [caregivers] = await pool.query(`
      SELECT c.id, c.user_id, c.name, c.specialization, c.status, c.is_available, c.max_capacity, u.email 
      FROM caregivers c 
      LEFT JOIN users u ON u.id = c.user_id
    `);
    console.log(`\nRows in 'caregivers' table (Total: ${caregivers.length}):`);
    console.table(caregivers);

    const [orphanedUsers] = await pool.query(`
      SELECT u.id, u.name, u.email, u.role 
      FROM users u 
      LEFT JOIN caregivers c ON c.user_id = u.id 
      WHERE u.role = 'caregiver' AND c.id IS NULL
    `);
    console.log(`\nCaregiver users WITHOUT a row in 'caregivers' table (Total: ${orphanedUsers.length}):`);
    console.table(orphanedUsers);

  } catch (err) {
    console.error('Error debugging:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

debug();
