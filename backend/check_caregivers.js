const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '111826',
    database: process.env.DB_NAME || 'familycare_db',
  });

  const [rows] = await pool.query('SELECT * FROM caregivers');
  console.log('Total caregivers in DB:', rows.length);
  if (rows.length > 0) console.log('First caregiver:', rows[0].name, rows[0].avatar_url);
  
  process.exit(0);
}
run();
