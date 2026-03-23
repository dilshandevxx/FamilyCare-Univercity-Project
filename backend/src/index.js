require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const healthRoutes = require('./routes/healthRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/appointments', appointmentRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ FamilyCare API is running' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
