require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { passport } = require('./config/passport');
const pool = require('./config/db');

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
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
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

  // ── caregivers.status (approval workflow) ─────────────────────
  try {
    if (!(await columnExists('caregivers', 'status'))) {
      await pool.query(
        "ALTER TABLE caregivers ADD COLUMN status ENUM('pending','approved','rejected') DEFAULT 'pending'"
      );
      // Existing caregivers are already in use — mark them approved
      await pool.query("UPDATE caregivers SET status = 'approved' WHERE status IS NULL OR status = 'pending'");
      console.log('✅ Migration: added caregivers.status (existing rows set to approved)');
    }
  } catch (err) { console.warn('⚠️  Migration (caregivers.status):', err.message); }
}

runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
