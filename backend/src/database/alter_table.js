require('dotenv').config({ path: '../../.env' });
const pool = require('../config/db');

const alter = async () => {
  try {
    console.log('Altering parents table...');
    await pool.query(`ALTER TABLE parents ADD COLUMN room_number VARCHAR(50)`);
    await pool.query(`ALTER TABLE parents ADD COLUMN care_status VARCHAR(50) DEFAULT 'STABLE'`);
    console.log('Alter success!');
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist.');
      process.exit(0);
    } else {
      console.error(err);
      process.exit(1);
    }
  }
};
alter();
