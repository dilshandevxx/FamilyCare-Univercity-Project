const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, avatar_url, created_at FROM users WHERE id = ?',
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
  const { name, email, phone, currentPassword, newPassword } = req.body;

  try {
    // 1. Fetch current user from database
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = users[0];

    // 2. Validate email availability if changing
    if (email && email !== user.email) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
      if (existing.length > 0) {
        return res.status(422).json({ error: 'Email already in use' });
      }
    }

    // 3. Handle password change if requested
    let hashedPassword = null;
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match' });
      }
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // 4. Update fields
    const updatedName  = name  || user.name;
    const updatedEmail = email || user.email;
    const updatedPhone = phone !== undefined ? phone : user.phone;

    if (hashedPassword) {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?',
        [updatedName, updatedEmail, updatedPhone, hashedPassword, req.user.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
        [updatedName, updatedEmail, updatedPhone, req.user.id]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
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

// ── Two-Factor Authentication ─────────────────────────────────

// GET /api/users/2fa/status
const get2FAStatus = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT tfa_enabled FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ tfa_enabled: !!rows[0].tfa_enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/2fa/setup
// Generates a new TOTP secret + QR code URL, stores secret (not yet enabled)
const setup2FA = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT name, email, tfa_enabled FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    if (rows[0].tfa_enabled)
      return res.status(400).json({ error: '2FA is already enabled for this account' });

    const secret = speakeasy.generateSecret({
      name: `FamilyCare (${rows[0].email})`,
      length: 20,
    });

    // Save secret so verify step can access it (not yet enabled)
    await pool.query(
      'UPDATE users SET tfa_secret = ?, tfa_enabled = 0 WHERE id = ?',
      [secret.base32, req.user.id]
    );

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,   // show to user as manual fallback
      qrCode: qrCodeDataUrl,   // data:image/png;base64,…
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/2fa/verify
// Verifies the TOTP token from the authenticator app and activates 2FA
const verify2FA = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'OTP token is required' });

  try {
    const [rows] = await pool.query(
      'SELECT tfa_secret, tfa_enabled FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    if (!rows[0].tfa_secret)
      return res.status(400).json({ error: 'Please call /2fa/setup first' });
    if (rows[0].tfa_enabled)
      return res.status(400).json({ error: '2FA is already enabled' });

    const valid = speakeasy.totp.verify({
      secret: rows[0].tfa_secret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''),
      window: 1,   // allow ±30 seconds clock drift
    });

    if (!valid) return res.status(400).json({ error: 'Invalid OTP — please try again' });

    await pool.query(
      'UPDATE users SET tfa_enabled = 1 WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Two-factor authentication has been enabled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/2fa/disable
// Disables 2FA after verifying the current OTP
const disable2FA = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'OTP token is required to disable 2FA' });

  try {
    const [rows] = await pool.query(
      'SELECT tfa_secret, tfa_enabled FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    if (!rows[0].tfa_enabled)
      return res.status(400).json({ error: '2FA is not enabled' });

    const valid = speakeasy.totp.verify({
      secret: rows[0].tfa_secret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''),
      window: 1,
    });

    if (!valid) return res.status(400).json({ error: 'Invalid OTP — please try again' });

    await pool.query(
      'UPDATE users SET tfa_enabled = 0, tfa_secret = NULL WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Two-factor authentication has been disabled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── helper: get or auto-create caregivers row ─────────────────
const getOrCreateCaregiverId = async (userId) => {
  let [cgRows] = await pool.query(
    'SELECT id FROM caregivers WHERE user_id = ?', [userId]
  );
  if (cgRows.length === 0) {
    // Auto-create missing caregivers row (handles accounts made before this fix)
    const [[user]] = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
    await pool.query(
      'INSERT IGNORE INTO caregivers (user_id, name) VALUES (?, ?)',
      [userId, user?.name || 'Caregiver']
    );
    [cgRows] = await pool.query('SELECT id FROM caregivers WHERE user_id = ?', [userId]);
  }
  return cgRows[0]?.id || null;
};

// ── GET /api/users/my-residents ───────────────────────────────
// Returns all parents (elders) assigned to the logged-in caregiver
// with their latest health log data
const getMyResidents = async (req, res) => {
  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);
    if (!caregiverId) return res.json([]);

    const [rows] = await pool.query(
      `SELECT
         p.id, p.name, p.age, p.medical_conditions, p.room_number, p.care_status,
         hl.blood_pressure, hl.heart_rate, hl.temperature, hl.meal_status,
         hl.notes        AS last_notes,
         hl.logged_at    AS last_update
       FROM parents p
       LEFT JOIN (
         SELECT h1.*
         FROM health_logs h1
         INNER JOIN (
           SELECT parent_id, MAX(logged_at) AS max_logged
           FROM health_logs
           GROUP BY parent_id
         ) h2 ON h1.parent_id = h2.parent_id AND h1.logged_at = h2.max_logged
       ) hl ON p.id = hl.parent_id
       WHERE p.assigned_caregiver_id = ?
       ORDER BY p.name`,
      [caregiverId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/users/dashboard-stats ───────────────────────────
// Returns key counts for the dashboard stat cards
const getDashboardStats = async (req, res) => {
  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);

    // Total assigned residents
    const [[{ total_residents }]] = await pool.query(
      'SELECT COUNT(*) AS total_residents FROM parents WHERE assigned_caregiver_id = ?',
      [caregiverId || 0]
    );

    // Logs completed today by this user
    const [[{ logs_today }]] = await pool.query(
      `SELECT COUNT(*) AS logs_today FROM health_logs
       WHERE logged_by = ? AND DATE(logged_at) = CURDATE()`,
      [req.user.id]
    );

    // Critical / urgent residents
    const [[{ urgent_count }]] = await pool.query(
      `SELECT COUNT(*) AS urgent_count FROM parents
       WHERE assigned_caregiver_id = ? AND care_status IN ('CRITICAL','NEEDS ATTENTION')`,
      [caregiverId || 0]
    );

    // Pending tasks = residents with no log today
    const [[{ pending_tasks }]] = await pool.query(
      `SELECT COUNT(*) AS pending_tasks FROM parents p
       WHERE p.assigned_caregiver_id = ?
         AND p.id NOT IN (
           SELECT DISTINCT parent_id FROM health_logs
           WHERE DATE(logged_at) = CURDATE()
         )`,
      [caregiverId || 0]
    );

    res.json({ total_residents, logs_today, pending_tasks, urgent_count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/notification-prefs
// Save child notification preferences
const updateNotificationPrefs = async (req, res) => {
  const { health_alerts, caregiver_updates, daily_reports, sms_alerts } = req.body;
  try {
    // Store as JSON in users table (notification_prefs column)
    // Gracefully skip if column doesn't exist yet
    const prefs = JSON.stringify({
      health_alerts:     health_alerts     !== undefined ? !!health_alerts     : true,
      caregiver_updates: caregiver_updates !== undefined ? !!caregiver_updates : true,
      daily_reports:     daily_reports     !== undefined ? !!daily_reports     : false,
      sms_alerts:        sms_alerts        !== undefined ? !!sms_alerts        : true,
    });
    try {
      await pool.query(
        'UPDATE users SET notification_prefs = ? WHERE id = ?',
        [prefs, req.user.id]
      );
    } catch (_) {
      // notification_prefs column not yet added — ignore silently
    }
    res.json({ message: 'Notification preferences saved', prefs: JSON.parse(prefs) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/notification-prefs
const getNotificationPrefs = async (req, res) => {
  try {
    let prefs = { health_alerts: true, caregiver_updates: true, daily_reports: false, sms_alerts: true };
    try {
      const [[row]] = await pool.query(
        'SELECT notification_prefs FROM users WHERE id = ?',
        [req.user.id]
      );
      if (row && row.notification_prefs) {
        prefs = JSON.parse(row.notification_prefs);
      }
    } catch (_) {}
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/users/account
// Permanently delete the authenticated user's account
const deleteAccount = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/child/stats
// Child-specific dashboard stats
const getChildDashboardStats = async (req, res) => {
  const child_id = req.user.id;
  try {
    // Total parents
    const [[{ total_parents }]] = await pool.query(
      'SELECT COUNT(*) AS total_parents FROM parents WHERE child_id = ?',
      [child_id]
    );

    // Alerts today (scoped to child's parents)
    const [[{ alerts_today }]] = await pool.query(
      `SELECT COUNT(*) AS alerts_today
       FROM alerts a
       JOIN parents p ON a.parent_id = p.id
       WHERE p.child_id = ? AND DATE(a.created_at) = CURDATE() AND a.is_resolved = 0`,
      [child_id]
    );

    // Active caregivers (distinct caregivers assigned to child's parents)
    const [[{ active_caregivers }]] = await pool.query(
      `SELECT COUNT(DISTINCT assigned_caregiver_id) AS active_caregivers
       FROM parents
       WHERE child_id = ? AND assigned_caregiver_id IS NOT NULL`,
      [child_id]
    );

    // Overall health status — derived from latest log condition across all parents
    const [latestLogs] = await pool.query(
      `SELECT hl.overall_condition
       FROM health_logs hl
       JOIN parents p ON hl.parent_id = p.id
       WHERE p.child_id = ?
       ORDER BY hl.logged_at DESC
       LIMIT 5`,
      [child_id]
    );

    let health_status = 'Stable';
    if (latestLogs.some(l => l.overall_condition === 'CRITICAL')) health_status = 'Critical';
    else if (latestLogs.some(l => l.overall_condition === 'NEEDS ATTENTION')) health_status = 'Needs Attention';
    else if (latestLogs.length === 0) health_status = 'No Data';

    // Recent activity feed (last 5 events across all child's parents)
    const [recentActivity] = await pool.query(
      `(SELECT
          'vitals' AS type,
          CONCAT('Vitals logged for ', p.name) AS title,
          hl.notes AS description,
          hl.logged_at AS timestamp
        FROM health_logs hl
        JOIN parents p ON hl.parent_id = p.id
        WHERE p.child_id = ?
        ORDER BY hl.logged_at DESC
        LIMIT 3)
       UNION ALL
       (SELECT
          'alert' AS type,
          a.title,
          a.description,
          a.created_at AS timestamp
        FROM alerts a
        JOIN parents p ON a.parent_id = p.id
        WHERE p.child_id = ? AND a.is_resolved = 0
        ORDER BY a.created_at DESC
        LIMIT 2)
       ORDER BY timestamp DESC
       LIMIT 5`,
      [child_id, child_id]
    );

    res.json({
      total_parents,
      active_caregivers,
      alerts_today,
      health_status,
      recent_activity: recentActivity
    });
  } catch (err) {
    console.error('Error fetching child dashboard stats:', err);
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
  get2FAStatus,
  setup2FA,
  verify2FA,
  disable2FA,
  getMyResidents,
  getDashboardStats,
  updateNotificationPrefs,
  getNotificationPrefs,
  deleteAccount,
  getChildDashboardStats,
};
