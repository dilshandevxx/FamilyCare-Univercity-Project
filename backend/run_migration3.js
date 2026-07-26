const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '111826',
    database: process.env.DB_NAME || 'familycare_db',
  });

  const columns = [
    'ADD COLUMN rating DECIMAL(2,1) DEFAULT NULL',
    'ADD COLUMN total_reviews INT DEFAULT 0',
    'ADD COLUMN location VARCHAR(100) DEFAULT NULL',
    'ADD COLUMN languages VARCHAR(200) DEFAULT NULL'
  ];

  for (let col of columns) {
    try {
      await pool.query('ALTER TABLE caregivers ' + col);
      console.log('Added column successfully:', col);
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Column already exists:', col);
      } else {
        console.error('Error adding column', col, ':', err.message);
      }
    }
  }
  
  process.exit(0);
}
run();
