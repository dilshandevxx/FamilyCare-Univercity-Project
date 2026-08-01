require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/src/config/db');

async function testAll() {
  try {
    console.log('--- USERS WITH CAREGIVER ROLE ---');
    const [users] = await pool.query("SELECT id, name, email, role, phone FROM users WHERE role = 'caregiver'");
    console.table(users);

    console.log('\n--- CAREGIVERS TABLE ---');
    const [caregivers] = await pool.query("SELECT id, user_id, name, specialization, hourly_rate, experience_years, status FROM caregivers");
    console.table(caregivers);

    console.log('\n--- PARENTS TABLE ---');
    const [parents] = await pool.query("SELECT id, child_user_id, name, age, assigned_caregiver_id FROM parents");
    console.table(parents);

    console.log('\n--- JOIN QUERY AS IN parentController.getParents ---');
    const [joinedParents] = await pool.query(`
      SELECT p.*, 
             cg.name AS caregiver_name, 
             cg.user_id AS caregiver_user_id,
             cg.specialization AS caregiver_specialization,
             cg.hourly_rate AS caregiver_hourly_rate,
             u.email AS caregiver_email, 
             u.phone AS caregiver_phone
      FROM parents p
      LEFT JOIN caregivers cg ON p.assigned_caregiver_id = cg.id
      LEFT JOIN users u ON (cg.user_id = u.id OR (cg.user_id IS NULL AND u.email = cg.email))
    `);
    console.table(joinedParents);

    console.log('\n--- JOIN QUERY AS IN caregiverController.getCaregivers ---');
    const [joinedCaregivers] = await pool.query(`
      SELECT 
        c.id,
        c.user_id,
        COALESCE(c.name, u.name) AS name,
        COALESCE(c.email, u.email) AS email,
        COALESCE(c.phone, u.phone) AS phone,
        COALESCE(c.avatar_url, u.avatar_url) AS avatar_url,
        c.specialization,
        c.experience_years,
        c.hourly_rate,
        c.bio,
        c.is_available,
        c.rating,
        c.total_reviews,
        c.location,
        c.languages,
        c.status,
        c.created_at
      FROM caregivers c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC, c.id DESC
    `);
    console.table(joinedCaregivers);

    process.exit(0);
  } catch (err) {
    console.error('Error running verification test:', err);
    process.exit(1);
  }
}

testAll();
