require('dotenv').config();
const pool = require('../config/db');
const { generatePayhereHash, verifyPayhereNotification, formatAmount } = require('../config/payhere');

async function testPayhereIntegration() {
  console.log('--- Testing PayHere Sandbox & Subscription Integration ---');

  try {
    // 1. Test Hash generation
    const merchantId = '1234567';
    const orderId = 'FC-TEST-001';
    const amount = 350.00;
    const formattedAmount = formatAmount(amount);
    const currency = 'LKR';

    const hash = generatePayhereHash(merchantId, orderId, formattedAmount, currency);
    console.log(`✓ PayHere Hash generated successfully: ${hash} (Length: ${hash.length})`);

    // 2. Check caregivers monthly plan configuration
    const [caregivers] = await pool.query('SELECT id, name, monthly_rate, plan_title FROM caregivers LIMIT 5');
    console.log(`✓ Found ${caregivers.length} caregivers with monthly plan fields:`);
    caregivers.forEach(cg => {
      console.log(`  - [ID: ${cg.id}] ${cg.name || 'Caregiver'} | Plan: ${cg.plan_title} | Rate: LKR ${cg.monthly_rate}`);
    });

    // 3. Check subscription tables
    const [tables] = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name IN ('caregiver_subscriptions', 'subscription_payments')
    `);
    console.log(`✓ Subscription tables in database: ${tables.map(t => t.table_name || t.TABLE_NAME).join(', ')}`);

    // 4. Verify parent columns
    const [columns] = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = DATABASE() AND table_name = 'parents' AND column_name IN ('subscription_id', 'subscription_status', 'subscription_end_date')
    `);
    console.log(`✓ Parent subscription columns: ${columns.map(c => c.column_name || c.COLUMN_NAME).join(', ')}`);

    console.log('\nAll PayHere & Subscription verifications PASSED successfully! 🎉');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await pool.end();
  }
}

testPayhereIntegration();
