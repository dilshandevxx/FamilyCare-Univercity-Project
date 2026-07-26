const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '111826',
    database: process.env.DB_NAME || 'familycare_db',
  });

  const sql = fs.readFileSync('src/database/add_caregiver_rating.sql', 'utf8');
  const queries = sql.split(';').map(q => q.trim()).filter(q => q.length > 0);

  for (let query of queries) {
    if (query.toUpperCase().startsWith('USE')) continue;
    try {
      console.log('Executing:', query);
      await pool.query(query);
    } catch (err) {
      console.error('Error executing query:', err.message);
    }
  }
  
  console.log('Migration completed.');
  process.exit(0);
}
run();
