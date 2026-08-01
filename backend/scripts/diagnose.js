require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('../src/config/db');

async function check() {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users');
    console.log('=== USERS ===');
    console.table(users);

    const [caregivers] = await pool.query('SELECT id, user_id, name, specialization, status, is_available FROM caregivers');
    console.log('\n=== CAREGIVERS ===');
    console.table(caregivers);

    const [parents] = await pool.query('SELECT id, child_id, name, assigned_caregiver_id FROM parents');
    console.log('\n=== PARENTS ===');
    console.table(parents);

    // Test /api/caregivers query
    const [cgQuery] = await pool.query('SELECT c.*, u.avatar_url, u.email, u.phone FROM caregivers c LEFT JOIN users u ON u.id = c.user_id');
    console.log('\n=== /api/caregivers count ===', cgQuery.length);
    console.table(cgQuery.map(c => ({ id: c.id, name: c.name, user_id: c.user_id, status: c.status, is_available: c.is_available })));

    // Test /api/caregivers/public query
    const [pubQuery] = await pool.query(`
      SELECT c.id, c.name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, u.avatar_url
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
    `);
    console.log('\n=== /api/caregivers/public count ===', pubQuery.length);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
