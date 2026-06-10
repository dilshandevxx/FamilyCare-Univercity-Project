const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function createAdmin() {
  try {
    const email = 'admin@familycare.com';
    const password = 'admin1234';
    const hashed = await bcrypt.hash(password, 10);
    
    // Check if exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      // Update password and ensure role is admin
      await pool.query('UPDATE users SET password = ?, role = "admin" WHERE email = ?', [hashed, email]);
      console.log('✅ Admin account updated successfully!');
    } else {
      // Create new
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Super Admin', email, hashed, 'admin']
      );
      console.log('✅ Admin account created successfully!');
    }
    
    console.log(`\n👉 Email: ${email}\n👉 Password: ${password}\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();
