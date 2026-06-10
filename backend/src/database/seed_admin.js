require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

(async () => {
  try {
    const email = 'admin@familycare.com';
    const password = 'admin123';
    const name = 'Rithwik Sen';
    const role = 'admin';

    console.log('Checking if administrator account exists in MySQL database...');
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      console.log('Admin user account found. Updating details & password hash...');
      const hashed = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password = ?, role = ? WHERE email = ?', [hashed, role, email]);
      console.log('✅ Admin user updated successfully.');
    } else {
      console.log('Admin user account not found. Creating a new one...');
      const hashed = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashed, role]
      );
      console.log('✅ Admin user created successfully.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    process.exit(1);
  }
})();
