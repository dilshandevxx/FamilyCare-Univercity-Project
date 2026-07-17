require('dotenv').config();
const pool = require('./src/config/db');

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_login_logs (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        user_id          INT,
        email_attempted  VARCHAR(150) NOT NULL,
        ip_address       VARCHAR(45),
        success          BOOLEAN NOT NULL DEFAULT FALSE,
        failure_reason   VARCHAR(255),
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('admin_login_logs table created successfully.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

run();
