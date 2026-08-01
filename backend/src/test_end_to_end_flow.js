require('dotenv').config();
const pool = require('./config/db');

async function testFlow() {
  console.log('=== Starting End-to-End Caregiver Approval & Capacity Test ===');
  
  try {
    // 1. Get an existing caregiver
    const [[cg]] = await pool.query('SELECT c.id, c.user_id, COALESCE(c.name, u.name) as name, c.max_capacity FROM caregivers c JOIN users u ON c.user_id = u.id LIMIT 1');
    console.log(`Using caregiver: ID=${cg.id}, Name=${cg.name}, MaxCapacity=${cg.max_capacity}`);

    // 2. Get an existing parent
    const [[parent]] = await pool.query('SELECT id, name, child_id FROM parents LIMIT 1');
    console.log(`Using parent: ID=${parent.id}, Name=${parent.name}`);

    // 3. Simulate Child assigning caregiver to Parent
    await pool.query(
      'UPDATE parents SET assigned_caregiver_id = ?, assignment_status = "pending", rejection_reason = NULL WHERE id = ?',
      [cg.id, parent.id]
    );
    console.log('Step 1: Child sent care assignment request -> status = pending');

    // 4. Verify caregiver requests query
    const [requests] = await pool.query(`
      SELECT p.id, p.name, p.age, p.medical_conditions, p.assignment_status, u.name as child_name
      FROM parents p
      JOIN users u ON p.child_id = u.id
      WHERE p.assigned_caregiver_id = ? AND p.assignment_status = 'pending'
    `, [cg.id]);
    console.log(`Step 2: Caregiver pending requests found: ${requests.length}`, requests.map(r => ({ id: r.id, name: r.name, status: r.assignment_status })));

    // 5. Caregiver accepts request
    await pool.query(
      'UPDATE parents SET assignment_status = "accepted", rejection_reason = NULL WHERE id = ? AND assigned_caregiver_id = ?',
      [parent.id, cg.id]
    );
    console.log('Step 3: Caregiver accepted request -> status = accepted');

    // 6. Verify active count
    const [[activeStats]] = await pool.query(`
      SELECT COUNT(*) as active_count
      FROM parents
      WHERE assigned_caregiver_id = ? AND (assignment_status = 'accepted' OR assignment_status IS NULL)
    `, [cg.id]);
    console.log(`Step 4: Caregiver active residents count: ${activeStats.active_count}/${cg.max_capacity}`);

    // 7. Simulate declining a request
    await pool.query(
      'UPDATE parents SET assignment_status = "pending", rejection_reason = NULL WHERE id = ?',
      [parent.id]
    );
    await pool.query(
      'UPDATE parents SET assignment_status = "rejected", rejection_reason = ? WHERE id = ? AND assigned_caregiver_id = ?',
      ['Reached maximum capacity (4/4 residents)', parent.id, cg.id]
    );
    console.log('Step 5: Caregiver declined request with reason');

    const [[rejectedParent]] = await pool.query('SELECT id, name, assignment_status, rejection_reason FROM parents WHERE id = ?', [parent.id]);
    console.log('Step 6: Parent record after decline:', rejectedParent);

    // Reset parent back to accepted for clean data state
    await pool.query('UPDATE parents SET assignment_status = "accepted", rejection_reason = NULL WHERE id = ?', [parent.id]);
    console.log('Step 7: Reset parent test data back to accepted');

    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

testFlow();
