require('dotenv').config();
const pool = require('./config/db');

async function testBackend() {
  console.log('--- TESTING CAREGIVER CAPACITY & ASSIGNMENT FLOW ---');
  try {
    // 1. Check caregivers with capacity
    const [cgs] = await pool.query(`
      SELECT c.id, c.name, COALESCE(c.max_capacity, 4) as max_capacity,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)) AS active_residents,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND p.assignment_status = 'pending') AS pending_requests
      FROM caregivers c
    `);
    console.log(`Caregivers found: ${cgs.length}`);
    cgs.forEach(c => {
      console.log(`- ${c.name || 'Caregiver #' + c.id}: ${c.active_residents}/${c.max_capacity} residents, ${c.pending_requests} pending requests`);
    });

    // 2. Check parents with assignment_status
    const [parents] = await pool.query(`
      SELECT id, name, assigned_caregiver_id, assignment_status, rejection_reason
      FROM parents
    `);
    console.log(`Parents found: ${parents.length}`);
    parents.forEach(p => {
      console.log(`- ${p.name}: Caregiver ID: ${p.assigned_caregiver_id}, Status: ${p.assignment_status}, Reason: ${p.rejection_reason}`);
    });

    console.log('✅ ALL QUERIES EXECUTED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  }
}

testBackend();
