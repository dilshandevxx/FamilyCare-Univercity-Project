const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Caregiver Settings ────────────────────────────────────────

// GET /api/users/caregiver-settings
const getCaregiverSettings = async (req, res) => {
  try {
    const [userRows] = await pool.query(
      'SELECT id, name, email, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    );
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const [cgRows] = await pool.query(
      `SELECT experience_years, bio, certification, license_id, is_available,
              notif_messages, notif_health, notif_visits,
              schedule_weekday_start, schedule_weekday_end, schedule_weekday_active,
              schedule_sat_start, schedule_sat_end, schedule_sat_active, schedule_sun_active
       FROM caregivers WHERE user_id = ?`,
      [req.user.id]
    );

    const cg = cgRows[0] || {
      experience_years: '', bio: '', certification: '', license_id: '',
      is_available: true,
      notif_messages: true, notif_health: true, notif_visits: false,
      schedule_weekday_start: '08:00', schedule_weekday_end: '17:30', schedule_weekday_active: true,
      schedule_sat_start: '10:00', schedule_sat_end: '14:00', schedule_sat_active: true,
      schedule_sun_active: false,
    };

    res.json({ ...userRows[0], ...cg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/caregiver-settings/profile
const updateCaregiverProfile = async (req, res) => {
  const { name, email, phone, experience_years, bio, certification, license_id } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone || null, req.user.id]
    );
    await pool.query(
      `INSERT INTO caregivers (user_id, name, experience_years, bio, certification, license_id)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name             = VALUES(name),
         experience_years = VALUES(experience_years),
         bio              = VALUES(bio),
         certification    = VALUES(certification),
         license_id       = VALUES(license_id)`,
      [req.user.id, name, experience_years || null, bio || null, certification || null, license_id || null]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/caregiver-settings/availability
const updateCaregiverAvailability = async (req, res) => {
  const {
    is_available,
    schedule_weekday_start, schedule_weekday_end, schedule_weekday_active,
    schedule_sat_start, schedule_sat_end, schedule_sat_active,
    schedule_sun_active,
  } = req.body;
  try {
    const [userRows] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
    const name = userRows[0]?.name || '';

    await pool.query(
      `INSERT INTO caregivers
         (user_id, name, is_available,
          schedule_weekday_start, schedule_weekday_end, schedule_weekday_active,
          schedule_sat_start,     schedule_sat_end,     schedule_sat_active,
          schedule_sun_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         is_available             = VALUES(is_available),
         schedule_weekday_start   = VALUES(schedule_weekday_start),
         schedule_weekday_end     = VALUES(schedule_weekday_end),
         schedule_weekday_active  = VALUES(schedule_weekday_active),
         schedule_sat_start       = VALUES(schedule_sat_start),
         schedule_sat_end         = VALUES(schedule_sat_end),
         schedule_sat_active      = VALUES(schedule_sat_active),
         schedule_sun_active      = VALUES(schedule_sun_active)`,
      [req.user.id, name, is_available ? 1 : 0,
       schedule_weekday_start, schedule_weekday_end, schedule_weekday_active ? 1 : 0,
       schedule_sat_start, schedule_sat_end, schedule_sat_active ? 1 : 0,
       schedule_sun_active ? 1 : 0]
    );
    res.json({ message: 'Availability updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/caregiver-settings/notifications
const updateCaregiverNotifications = async (req, res) => {
  const { notif_messages, notif_health, notif_visits } = req.body;
  try {
    const [userRows] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
    const name = userRows[0]?.name || '';

    await pool.query(
      `INSERT INTO caregivers (user_id, name, notif_messages, notif_health, notif_visits)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         notif_messages = VALUES(notif_messages),
         notif_health   = VALUES(notif_health),
         notif_visits   = VALUES(notif_visits)`,
      [req.user.id, name, notif_messages ? 1 : 0, notif_health ? 1 : 0, notif_visits ? 1 : 0]
    );
    res.json({ message: 'Notification preferences updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/caregiver-settings/password
const updateCaregiverPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'Both current and new password are required' });
  if (newPassword.length < 8)
    return res.status(400).json({ error: 'New password must be at least 8 characters' });

  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/avatar
const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  try {
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);
    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getCaregiverSettings,
  updateCaregiverProfile,
  updateCaregiverAvailability,
  updateCaregiverNotifications,
  updateCaregiverPassword,
  uploadAvatar,
};
