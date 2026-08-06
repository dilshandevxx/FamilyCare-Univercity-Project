require('dotenv').config();
const pool = require('../config/db');

async function runSubscriptionMigrations() {
  console.log(`Connecting to database ${process.env.DB_NAME} on ${process.env.DB_HOST}...`);
  const conn = await pool.getConnection();

  try {
    console.log('1. Checking and updating caregivers table for monthly subscription plans...');
    const caregiverColumns = [
      { name: 'monthly_rate', sql: `ALTER TABLE caregivers ADD COLUMN monthly_rate DECIMAL(10,2) DEFAULT 350.00` },
      { name: 'plan_title', sql: `ALTER TABLE caregivers ADD COLUMN plan_title VARCHAR(150) DEFAULT 'Comprehensive Monthly Care Plan'` },
      { name: 'plan_description', sql: `ALTER TABLE caregivers ADD COLUMN plan_description TEXT NULL` },
      { name: 'plan_features', sql: `ALTER TABLE caregivers ADD COLUMN plan_features TEXT NULL` },
    ];

    for (const col of caregiverColumns) {
      try {
        await conn.query(col.sql);
        console.log(`   ✓ Added ${col.name} column to caregivers.`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ✓ ${col.name} column already exists in caregivers.`);
        } else {
          console.log(`   - ${col.name}:`, e.message);
        }
      }
    }

    console.log('2. Creating caregiver_subscriptions table if not exists...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS caregiver_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        child_id INT NOT NULL,
        parent_id INT NOT NULL,
        caregiver_id INT NOT NULL,
        plan_name VARCHAR(150) NOT NULL DEFAULT 'Comprehensive Monthly Care Plan',
        amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
        status ENUM('active', 'expired', 'cancelled', 'pending') NOT NULL DEFAULT 'active',
        payment_method VARCHAR(50) DEFAULT 'PayHere Sandbox',
        payhere_payment_id VARCHAR(100) NULL,
        transaction_id VARCHAR(100) NOT NULL,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        auto_renew BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sub_child (child_id),
        INDEX idx_sub_parent (parent_id),
        INDEX idx_sub_caregiver (caregiver_id)
      ) ENGINE=InnoDB;
    `);
    console.log('   ✓ caregiver_subscriptions table ready.');

    console.log('3. Creating subscription_payments table if not exists...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscription_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subscription_id INT NULL,
        child_id INT NOT NULL,
        parent_id INT NOT NULL,
        caregiver_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
        payment_gateway VARCHAR(50) DEFAULT 'PayHere Sandbox',
        payhere_order_id VARCHAR(100) NOT NULL,
        payhere_payment_id VARCHAR(100) NULL,
        payment_status ENUM('succeeded', 'pending', 'failed', 'refunded') DEFAULT 'succeeded',
        raw_response TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pay_child (child_id),
        INDEX idx_pay_sub (subscription_id)
      ) ENGINE=InnoDB;
    `);
    console.log('   ✓ subscription_payments table ready.');

    console.log('4. Checking and updating parents table for subscription tracking...');
    const parentColumns = [
      { name: 'subscription_id', sql: `ALTER TABLE parents ADD COLUMN subscription_id INT NULL` },
      { name: 'subscription_status', sql: `ALTER TABLE parents ADD COLUMN subscription_status ENUM('active', 'expired', 'unpaid', 'none') DEFAULT 'none'` },
      { name: 'subscription_end_date', sql: `ALTER TABLE parents ADD COLUMN subscription_end_date DATETIME NULL` },
    ];

    for (const col of parentColumns) {
      try {
        await conn.query(col.sql);
        console.log(`   ✓ Added ${col.name} column to parents.`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ✓ ${col.name} column already exists in parents.`);
        } else {
          console.log(`   - ${col.name}:`, e.message);
        }
      }
    }

    // Set default initial monthly rates for any existing caregivers with 0 or null
    try {
      await conn.query(`
        UPDATE caregivers 
        SET monthly_rate = 350.00,
            plan_title = 'Comprehensive Monthly Care Plan',
            plan_description = 'Includes daily vital sign logging, 24/7 emergency response, medication tracking, and weekly wellness reports.',
            plan_features = 'Daily Vitals Tracking,Medication Management,24/7 Care Chat,Weekly Wellness Report,Emergency Response'
        WHERE monthly_rate IS NULL OR monthly_rate = 0.00
      `);
      console.log('   ✓ Seeded default monthly plan values for caregivers with empty plans.');
    } catch (seedErr) {
      console.log('   - Seed plan warning:', seedErr.message);
    }

    console.log('\n🎉 All subscription database migrations executed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

runSubscriptionMigrations();
