/**
 * seed_residents.js
 * ─────────────────────────────────────────────────────────────
 * Fixes the "No residents assigned" problem automatically.
 *
 * Run from the backend folder:
 *   node src/database/seed_residents.js
 * ─────────────────────────────────────────────────────────────
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const pool = require('../config/db');

(async () => {
  try {
    console.log('\n🔧  FamilyCare — Resident Setup Script\n');

    // ── 1. Find all caregiver users ───────────────────────────
    const [caregiverUsers] = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'caregiver'"
    );
    if (caregiverUsers.length === 0) {
      console.log('❌  No caregiver accounts found.');
      console.log('    Register a caregiver account first, then re-run this script.');
      process.exit(1);
    }
    console.log('👤  Caregiver accounts found:');
    caregiverUsers.forEach(u => console.log(`    id=${u.id}  name="${u.name}"  email=${u.email}`));

    // ── 2. Ensure every caregiver has a caregivers table row ──
    for (const u of caregiverUsers) {
      const [existing] = await pool.query(
        'SELECT id FROM caregivers WHERE user_id = ?', [u.id]
      );
      if (existing.length === 0) {
        await pool.query(
          'INSERT IGNORE INTO caregivers (user_id, name) VALUES (?, ?)',
          [u.id, u.name]
        );
        console.log(`  ✅  Created caregivers row for "${u.name}"`);
      } else {
        console.log(`  ℹ️   Caregivers row already exists for "${u.name}" (caregiver id=${existing[0].id})`);
      }
    }

    // ── 3. Fetch updated caregivers rows ──────────────────────
    const [cgRows] = await pool.query(
      'SELECT c.id, c.name, u.id AS user_id FROM caregivers c JOIN users u ON u.id = c.user_id'
    );

    // Use first caregiver (Ravi) as default assignee
    const primary = cgRows[0];
    console.log(`\n📋  Primary caregiver for assignment: "${primary.name}" (caregiver id=${primary.id})`);

    // ── 4. Check existing residents ───────────────────────────
    const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM parents');
    console.log(`\n🏠  Residents currently in DB: ${count}`);

    if (Number(count) === 0) {
      // ── 5a. No residents — insert sample data ────────────────
      console.log('    No residents found — inserting sample residents…\n');

      const samples = [
        { name: 'Eleanor Vance',   age: 82, conditions: 'Hypertension, Type 2 DM',    room: '402', status: 'STABLE'          },
        { name: 'Robert Sterling', age: 78, conditions: 'Post-Stroke Recovery',         room: '215', status: 'STABLE'          },
        { name: 'Clara Oswald',    age: 74, conditions: 'Type 2 Diabetes',              room: '318', status: 'NEEDS ATTENTION' },
        { name: 'Arthur Jenkins',  age: 80, conditions: 'Congestive Heart Failure',     room: '101', status: 'CRITICAL'        },
      ];

      for (const s of samples) {
        await pool.query(
          `INSERT INTO parents
             (child_id, name, age, medical_conditions, room_number, care_status, assigned_caregiver_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [primary.user_id, s.name, s.age, s.conditions, s.room, s.status, primary.id]
        );
        console.log(`  ✅  Added resident: "${s.name}" → assigned to "${primary.name}"`);
      }
    } else {
      // ── 5b. Residents exist — fix any that are unassigned ───
      const [unassigned] = await pool.query(
        `SELECT id, name FROM parents
         WHERE assigned_caregiver_id IS NULL
            OR assigned_caregiver_id NOT IN (SELECT id FROM caregivers)`
      );

      if (unassigned.length > 0) {
        console.log(`    Fixing ${unassigned.length} unassigned resident(s)…`);
        await pool.query(
          `UPDATE parents SET assigned_caregiver_id = ?
           WHERE assigned_caregiver_id IS NULL
              OR assigned_caregiver_id NOT IN (SELECT id FROM caregivers)`,
          [primary.id]
        );
        unassigned.forEach(r =>
          console.log(`  ✅  Assigned "${r.name}" → "${primary.name}"`)
        );
      } else {
        console.log('  ℹ️   All residents are already assigned.');
      }
    }

    // ── 6. Final summary ──────────────────────────────────────
    const [final] = await pool.query(
      `SELECT p.name AS resident, p.room_number, p.care_status,
              c.name AS caregiver
       FROM parents p
       LEFT JOIN caregivers c ON c.id = p.assigned_caregiver_id
       ORDER BY p.name`
    );

    console.log('\n─────────────────────────────────────────────────────');
    console.log('✅  DONE — Final resident list:\n');
    console.log('  Resident              Room   Status            Caregiver');
    console.log('  ──────────────────────────────────────────────────────');
    final.forEach(r =>
      console.log(
        `  ${r.resident.padEnd(22)} ${(r.room_number || '—').padEnd(6)} ${(r.care_status || '—').padEnd(18)} ${r.caregiver || 'Unassigned'}`
      )
    );
    console.log('\n🚀  Refresh the Add Health Log page — residents will now appear!\n');

  } catch (err) {
    console.error('\n❌  Error:', err.message);
  } finally {
    process.exit();
  }
})();
