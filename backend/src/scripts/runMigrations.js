require('dotenv').config();
const pool = require('../config/db');

async function runMigrations() {
  console.log(`Connecting to database ${process.env.DB_NAME} on ${process.env.DB_HOST}...`);
  const conn = await pool.getConnection();

  try {
    console.log('1. Checking and updating users table for Google OAuth...');
    // Modify password to allow NULL for OAuth users
    try {
      await conn.query(`ALTER TABLE users MODIFY password VARCHAR(255) NULL`);
      console.log('   ✓ users.password is now NULLABLE.');
    } catch (e) {
      console.log('   - users.password update:', e.message);
    }

    // Add google_id if not present
    try {
      await conn.query(`ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL`);
      console.log('   ✓ Added google_id column to users.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ✓ google_id column already exists.');
      } else {
        console.log('   - google_id:', e.message);
      }
    }

    // Add auth_provider if not present
    try {
      await conn.query(`ALTER TABLE users ADD COLUMN auth_provider ENUM('local', 'google', 'facebook') DEFAULT 'local'`);
      console.log('   ✓ Added auth_provider column to users.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ✓ auth_provider column already exists.');
      } else {
        console.log('   - auth_provider:', e.message);
      }
    }

    console.log('2. Checking and updating caregivers table for capacity...');
    try {
      await conn.query(`ALTER TABLE caregivers ADD COLUMN max_capacity INT DEFAULT 4`);
      console.log('   ✓ Added max_capacity column to caregivers.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ✓ max_capacity column already exists.');
      } else {
        console.log('   - max_capacity:', e.message);
      }
    }

    console.log('3. Checking and updating parents table for assignment status...');
    try {
      await conn.query(`ALTER TABLE parents ADD COLUMN assignment_status ENUM('pending', 'accepted', 'rejected') DEFAULT 'accepted'`);
      console.log('   ✓ Added assignment_status column to parents.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ✓ assignment_status column already exists.');
      } else {
        console.log('   - assignment_status:', e.message);
      }
    }

    try {
      await conn.query(`ALTER TABLE parents ADD COLUMN rejection_reason TEXT NULL`);
      console.log('   ✓ Added rejection_reason column to parents.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ✓ rejection_reason column already exists.');
      } else {
        console.log('   - rejection_reason:', e.message);
      }
    }

    console.log('\n🎉 All database migrations executed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

runMigrations();
