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

async function runMigrations() {
  try {
    const [cols] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME   = 'messages'
         AND COLUMN_NAME  = 'is_read'`
    );
    if (cols[0].cnt === 0) {
      await pool.query(
        'ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE'
      );
      console.log('✅ Migration: added is_read column to messages');
    }
  } catch (err) {
    console.warn('⚠️  Migration skipped:', err.message);
  }
}

runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
