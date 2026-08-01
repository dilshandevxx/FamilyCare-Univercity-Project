require('dotenv').config();
const pool = require('./config/db');

async function testAll() {
  try {
    console.log('--- TEST 1: CAREGIVERS QUERY ---');
    const [cgs] = await pool.query(`
      SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, c.status,
             u.avatar_url,
             u.email, u.phone
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
      ORDER BY c.id DESC
    `);
    console.log(`Found ${cgs.length} caregivers:`);
    console.table(cgs.map(c => ({ id: c.id, name: c.name, specialization: c.specialization, user_id: c.user_id, status: c.status })));

    console.log('\n--- TEST 2: PUBLIC CAREGIVERS QUERY ---');
    const [pubCgs] = await pool.query(`
      SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name, c.specialization, c.experience_years,
             c.certification, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages,
             u.avatar_url
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.status = 'approved' OR c.status IS NULL
      ORDER BY c.id DESC
    `);
    console.log(`Found ${pubCgs.length} public caregivers:`);
    console.table(pubCgs.map(c => ({ id: c.id, name: c.name, specialization: c.specialization, user_id: c.user_id })));

    console.log('\n--- TEST 3: PARENTS WITH CAREGIVERS JOIN ---');
    const [parents] = await pool.query(`
      SELECT parents.*, 
             COALESCE(caregivers.name, u.name) AS caregiver_name, 
             caregivers.user_id AS caregiver_user_id,
             caregivers.specialization AS caregiver_specialization,
             caregivers.hourly_rate AS caregiver_hourly_rate,
             u.avatar_url AS caregiver_avatar_url,
             u.phone AS caregiver_phone,
             u.email AS caregiver_email
      FROM parents 
      LEFT JOIN caregivers ON parents.assigned_caregiver_id = caregivers.id 
      LEFT JOIN users u ON caregivers.user_id = u.id
      ORDER BY parents.created_at DESC
    `);
    console.log(`Found ${parents.length} parents:`);
    console.table(parents.map(p => ({ id: p.id, name: p.name, caregiver_name: p.caregiver_name, assigned_caregiver_id: p.assigned_caregiver_id })));

    console.log('\n--- TEST 4: ADMIN CAREGIVERS LIST QUERY ---');
    const [adminCgs] = await pool.query(`
      SELECT c.id, COALESCE(c.name, u.name) AS name, c.specialization, c.is_available,
             u.email, u.name AS user_name,
             COUNT(p.id) AS resident_count
      FROM caregivers c
      LEFT JOIN users u    ON u.id  = c.user_id
      LEFT JOIN parents p  ON p.assigned_caregiver_id = c.id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);
    console.log(`Found ${adminCgs.length} admin caregivers:`);
    console.table(adminCgs);

    console.log('\nALL 4 QUERIES COMPLETED WITH ZERO ERRORS!');
    process.exit(0);
  } catch (err) {
    console.error('Error running test:', err);
    process.exit(1);
  }
}

testAll();

