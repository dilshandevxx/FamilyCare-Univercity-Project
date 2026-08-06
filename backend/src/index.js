require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { passport } = require('./config/passport');
const pool = require('./config/db');
const { logMiddleware } = require('./middleware/logStreamer');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const healthRoutes = require('./routes/healthRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const parentRoutes = require('./routes/parentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(logMiddleware);
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/health-attachments', express.static(path.join(__dirname, '../uploads/health-attachments')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/alerts', alertRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ FamilyCare API is running' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── DB migrations then start ──────────────────────────────────
const PORT = process.env.PORT || 5000;

async function columnExists(table, column) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS cnt
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = ?
       AND COLUMN_NAME  = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

async function runMigrations() {
  // ── messages.is_read ─────────────────────────────────────────
  try {
    if (!(await columnExists('messages', 'is_read'))) {
      await pool.query('ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE');
      console.log('✅ Migration: added messages.is_read');
    }
  } catch (err) { console.warn('⚠️  Migration (messages.is_read):', err.message); }

  // ── users table extensions ────────────────────────────────────
  const userFields = [
    ['avatar_url',    'ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL'],
    ['tfa_secret',    'ADD COLUMN tfa_secret VARCHAR(255) DEFAULT NULL'],
    ['tfa_enabled',   'ADD COLUMN tfa_enabled TINYINT(1) DEFAULT 0'],
    ['google_id',     'ADD COLUMN google_id VARCHAR(100) DEFAULT NULL'],
    ['auth_provider', "ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'local'"],
  ];
  for (const [col, ddl] of userFields) {
    try {
      if (!(await columnExists('users', col))) {
        await pool.query(`ALTER TABLE users ${ddl}`);
        console.log(`✅ Migration: added users.${col}`);
      }
    } catch (err) { console.warn(`⚠️  Migration (users.${col}):`, err.message); }
  }

  // ── caregivers table extensions ───────────────────────────────
  const caregiverFields = [
    ['status',            "ADD COLUMN status ENUM('pending','approved','rejected') DEFAULT 'approved'"],
    ['approved_at',       'ADD COLUMN approved_at DATETIME NULL'],
    ['rejected_at',       'ADD COLUMN rejected_at DATETIME NULL'],
    ['rejection_reason',  'ADD COLUMN rejection_reason TEXT NULL'],
    ['monthly_rate',      'ADD COLUMN monthly_rate DECIMAL(10,2) DEFAULT 350.00'],
    ['plan_title',        "ADD COLUMN plan_title VARCHAR(150) DEFAULT 'Comprehensive Monthly Care Plan'"],
    ['plan_description',  'ADD COLUMN plan_description TEXT NULL'],
    ['plan_features',     'ADD COLUMN plan_features TEXT NULL'],
    ['max_capacity',      'ADD COLUMN max_capacity INT DEFAULT 4'],
    ['rating',            'ADD COLUMN rating DECIMAL(2,1) DEFAULT 4.9'],
    ['total_reviews',     'ADD COLUMN total_reviews INT DEFAULT 18'],
    ['location',          "ADD COLUMN location VARCHAR(100) DEFAULT 'In-Home & Clinical Visits'"],
    ['languages',         "ADD COLUMN languages VARCHAR(200) DEFAULT 'English, Sinhala'"],
  ];
  for (const [col, ddl] of caregiverFields) {
    try {
      if (!(await columnExists('caregivers', col))) {
        await pool.query(`ALTER TABLE caregivers ${ddl}`);
        console.log(`✅ Migration: added caregivers.${col}`);
      }
    } catch (err) { console.warn(`⚠️  Migration (caregivers.${col}):`, err.message); }
  }

  // Ensure default plans and approved status for existing caregivers
  try {
    await pool.query(`
      UPDATE caregivers SET 
        status = 'approved',
        monthly_rate = COALESCE(monthly_rate, 350.00),
        plan_title = COALESCE(plan_title, 'Comprehensive Monthly Care Plan'),
        plan_description = COALESCE(plan_description, 'Full-spectrum daily elder care, vital signs logging, and continuous health monitoring.'),
        plan_features = COALESCE(plan_features, 'Daily Vital Signs Logging\\nMedication Reminders & Tracking\\n24/7 Priority Emergency Support\\nWeekly Family Health Progress Reports'),
        max_capacity = COALESCE(max_capacity, 4),
        rating = COALESCE(rating, 4.9),
        total_reviews = COALESCE(total_reviews, 18),
        location = COALESCE(location, 'In-Home & Clinical Visits'),
        languages = COALESCE(languages, 'English, Sinhala')
      WHERE status IS NULL OR status = 'pending' OR monthly_rate IS NULL
    `);
  } catch (err) { console.warn('⚠️  Migration (caregivers data defaults):', err.message); }

  // ── parents table extensions ──────────────────────────────────
  const parentFields = [
    ['room_number',           'ADD COLUMN room_number VARCHAR(20) DEFAULT NULL'],
    ['care_status',           'ADD COLUMN care_status VARCHAR(50) DEFAULT NULL'],
    ['assignment_status',     "ADD COLUMN assignment_status ENUM('pending','accepted','rejected') DEFAULT 'accepted'"],
    ['rejection_reason',      'ADD COLUMN rejection_reason VARCHAR(255) DEFAULT NULL'],
    ['subscription_id',       'ADD COLUMN subscription_id INT DEFAULT NULL'],
    ['subscription_status',   "ADD COLUMN subscription_status ENUM('active','expired','unpaid','none') DEFAULT 'none'"],
    ['subscription_end_date', 'ADD COLUMN subscription_end_date DATETIME DEFAULT NULL'],
  ];
  for (const [col, ddl] of parentFields) {
    try {
      if (!(await columnExists('parents', col))) {
        await pool.query(`ALTER TABLE parents ${ddl}`);
        console.log(`✅ Migration: added parents.${col}`);
      }
    } catch (err) { console.warn(`⚠️  Migration (parents.${col}):`, err.message); }
  }

  // ── subscription_payments table ───────────────────────────────
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscription_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subscription_id INT NULL,
        child_id INT NOT NULL,
        parent_id INT NOT NULL,
        caregiver_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
        payment_gateway VARCHAR(50) DEFAULT 'PayHere Sandbox',
        payhere_order_id VARCHAR(100) NOT NULL,
        payhere_payment_id VARCHAR(100) NULL,
        payment_status ENUM('succeeded','pending','failed','refunded') DEFAULT 'succeeded',
        raw_response TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Migration: ensured subscription_payments table');
  } catch (err) { console.warn('⚠️  Migration (subscription_payments):', err.message); }

  // ── health_logs extended fields ───────────────────────────────
  const healthExtFields = [
    ['breakfast_status',  "ADD COLUMN breakfast_status  ENUM('Completed','Skipped','Pending') DEFAULT 'Pending'"],
    ['lunch_status',      "ADD COLUMN lunch_status      ENUM('Completed','Skipped','Pending') DEFAULT 'Pending'"],
    ['dinner_status',     "ADD COLUMN dinner_status     ENUM('Completed','Skipped','Pending') DEFAULT 'Pending'"],
    ['meds_taken',        'ADD COLUMN meds_taken        TINYINT(1) DEFAULT NULL'],
    ['meds_notes',        'ADD COLUMN meds_notes        TEXT DEFAULT NULL'],
    ['clinical_notes',    'ADD COLUMN clinical_notes    TEXT DEFAULT NULL'],
    ['mood',              'ADD COLUMN mood              VARCHAR(50) DEFAULT NULL'],
    ['overall_condition', "ADD COLUMN overall_condition ENUM('STABLE','NEEDS ATTENTION','CRITICAL') DEFAULT 'STABLE'"],
    ['attachment_url',    'ADD COLUMN attachment_url    VARCHAR(255) DEFAULT NULL'],
  ];
  for (const [col, ddl] of healthExtFields) {
    try {
      if (!(await columnExists('health_logs', col))) {
        await pool.query(`ALTER TABLE health_logs ${ddl}`);
        console.log(`✅ Migration: added health_logs.${col}`);
      }
    } catch (err) { console.warn(`⚠️  Migration (health_logs.${col}):`, err.message); }
  }

  // ── settings table ────────────────────────────────────────────
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        k VARCHAR(50) PRIMARY KEY,
        v VARCHAR(255) NOT NULL
      )
    `);
    await pool.query(`
      INSERT IGNORE INTO settings (k, v) VALUES 
      ('twoFactor', 'false'),
      ('sessionTimeout', '30'),
      ('hrThreshold', '100'),
      ('tempThreshold', '100.4')
    `);
    console.log('✅ Migration: ensured settings table and defaults');
  } catch (err) { console.warn('⚠️  Migration (settings):', err.message); }
}

runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
