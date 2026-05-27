const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function init() {
  const password = process.env.DB_PASSWORD === 'YOUR_MYSQL_PASSWORD_HERE' ? '' : process.env.DB_PASSWORD;
  
  console.log('Connecting to MySQL at', process.env.DB_HOST, 'as', process.env.DB_USER, '...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: password,
      multipleStatements: true
    });
    
    console.log('Connected. Re-creating database familycare_db...');
    await connection.query('DROP DATABASE IF EXISTS familycare_db;');
    
    console.log('Reading schema.sql...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('Executing schema queries...');
    await connection.query(sql);
    
    console.log('Database "familycare_db" initialized successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    console.log('\n--- Troubleshooting ---');
    console.log('1. Make sure your MySQL server is running.');
    console.log('2. Check if the password in backend/.env is correct.');
    console.log('3. If you do not have a password for the "root" user, set DB_PASSWORD= in backend/.env');
    process.exit(1);
  }
}

init();
