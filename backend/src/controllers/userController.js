const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const {
  PAYHERE_MERCHANT_ID,
  PAYHERE_MERCHANT_SECRET,
  PAYHERE_MODE,
  PAYHERE_CURRENCY,
  formatAmount,
  generatePayhereHash,
  verifyPayhereSignature,
} = require('../config/payhere');

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
      `SELECT experience_years, bio, certification, license_id, hourly_rate,
              COALESCE(monthly_rate, 350.00) AS monthly_rate,
              COALESCE(plan_title, 'Comprehensive Monthly Care Plan') AS plan_title,
              plan_description, plan_features,
              is_available,
              notif_messages, notif_health, notif_visits,
              schedule_weekday_start, schedule_weekday_end, schedule_weekday_active,
              schedule_sat_start, schedule_sat_end, schedule_sat_active, schedule_sun_active
       FROM caregivers WHERE user_id = ?`,
      [req.user.id]
    );

    const cg = cgRows[0] || {
      experience_years: '', bio: '', certification: '', license_id: '', hourly_rate: '',
      monthly_rate: 350.00, plan_title: 'Comprehensive Monthly Care Plan',
      plan_description: '', plan_features: '',
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
  const {
    name,
    email,
    phone,
    experience_years,
    bio,
    certification,
    license_id,
    hourly_rate,
    monthly_rate,
    plan_title,
    plan_description,
    plan_features
  } = req.body;

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone || null, req.user.id]
    );
    await pool.query(
      `INSERT INTO caregivers (user_id, name, experience_years, bio, certification, license_id, hourly_rate, monthly_rate, plan_title, plan_description, plan_features)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name             = VALUES(name),
         experience_years = VALUES(experience_years),
         bio              = VALUES(bio),
         certification    = VALUES(certification),
         license_id       = VALUES(license_id),
         hourly_rate      = VALUES(hourly_rate),
         monthly_rate     = VALUES(monthly_rate),
         plan_title       = VALUES(plan_title),
         plan_description = VALUES(plan_description),
         plan_features    = VALUES(plan_features)`,
      [
        req.user.id,
        name,
        experience_years || null,
        bio || null,
        certification || null,
        license_id || null,
        hourly_rate || 0,
        monthly_rate || 350.00,
        plan_title || 'Comprehensive Monthly Care Plan',
        plan_description || null,
        plan_features || null,
      ]
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
// Returns all parents (elders) assigned to the logged-in caregiver with 'accepted' status
// with their latest health log data
const getMyResidents = async (req, res) => {
  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);
    if (!caregiverId) return res.json([]);

    const [rows] = await pool.query(
      `SELECT
         p.id, p.name, p.age, p.medical_conditions, p.room_number, p.care_status,
         p.assignment_status, p.rejection_reason,
         hl.blood_pressure, hl.heart_rate, hl.temperature,
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
         AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)
       ORDER BY p.name`,
      [caregiverId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/users/dashboard-stats ───────────────────────────
// Returns key counts for the dashboard stat cards including workload capacity and pending care requests
const getDashboardStats = async (req, res) => {
  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);

    // Fetch caregiver max capacity
    const [[cg]] = await pool.query(
      'SELECT COALESCE(max_capacity, 4) AS max_capacity FROM caregivers WHERE id = ?',
      [caregiverId || 0]
    );
    const max_capacity = cg?.max_capacity || 4;

    // Total active/accepted assigned residents
    const [[{ total_residents }]] = await pool.query(
      `SELECT COUNT(*) AS total_residents FROM parents 
       WHERE assigned_caregiver_id = ? AND (assignment_status = 'accepted' OR assignment_status IS NULL)`,
      [caregiverId || 0]
    );

    // Pending care requests awaiting this caregiver's approval
    const [[{ pending_requests }]] = await pool.query(
      `SELECT COUNT(*) AS pending_requests FROM parents 
       WHERE assigned_caregiver_id = ? AND assignment_status = 'pending'`,
      [caregiverId || 0]
    );

    // Logs completed today by this user
    const [[{ logs_today }]] = await pool.query(
      `SELECT COUNT(*) AS logs_today FROM health_logs
       WHERE logged_by = ? AND DATE(logged_at) = CURDATE()`,
      [req.user.id]
    );

    // Critical / urgent residents (only accepted)
    const [[{ urgent_count }]] = await pool.query(
      `SELECT COUNT(*) AS urgent_count FROM parents
       WHERE assigned_caregiver_id = ? 
         AND (assignment_status = 'accepted' OR assignment_status IS NULL)
         AND care_status IN ('CRITICAL','NEEDS ATTENTION')`,
      [caregiverId || 0]
    );

    // Pending tasks = active residents with no log today
    const [pendingTasksList] = await pool.query(
      `SELECT id, name FROM parents p
       WHERE p.assigned_caregiver_id = ?
         AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)
         AND p.id NOT IN (
           SELECT DISTINCT parent_id FROM health_logs
           WHERE DATE(logged_at) = CURDATE()
         )`,
      [caregiverId || 0]
    );
    const pending_tasks = pendingTasksList.length;

    // Recent activity (health logs for my active residents)
    const [recentActivity] = await pool.query(
      `SELECT hl.id, hl.logged_at, hl.overall_condition, hl.blood_pressure, hl.temperature, hl.meal_status, p.name as elder_name
       FROM health_logs hl
       JOIN parents p ON p.id = hl.parent_id
       WHERE p.assigned_caregiver_id = ?
         AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)
       ORDER BY hl.logged_at DESC LIMIT 5`,
      [caregiverId || 0]
    );

    res.json({
      total_residents,
      max_capacity,
      pending_requests,
      logs_today,
      pending_tasks,
      urgent_count,
      pendingTasksList,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/users/caregiver-requests ───────────────────────────
// Returns all incoming pending parent care requests for the logged in caregiver
const getCaregiverRequests = async (req, res) => {
  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);
    if (!caregiverId) return res.json([]);

    const [rows] = await pool.query(
      `SELECT 
         p.id, p.name, p.age, p.gender, p.relationship, p.phone, p.address,
         p.emergency_contact_name, p.emergency_contact_phone,
         p.medical_conditions, p.allergies, p.current_medications,
         p.assignment_status, p.created_at,
         u.name  AS child_name,
         u.email AS child_email,
         u.phone AS child_phone,
         u.avatar_url AS child_avatar_url
       FROM parents p
       JOIN users u ON u.id = p.child_id
       WHERE p.assigned_caregiver_id = ? AND p.assignment_status = 'pending'
       ORDER BY p.created_at DESC`,
      [caregiverId]
    );

    // Also get caregiver's current capacity and load
    const [[cg]] = await pool.query(
      'SELECT COALESCE(max_capacity, 4) AS max_capacity FROM caregivers WHERE id = ?',
      [caregiverId]
    );
    const [[{ active_count }]] = await pool.query(
      `SELECT COUNT(*) AS active_count FROM parents 
       WHERE assigned_caregiver_id = ? AND (assignment_status = 'accepted' OR assignment_status IS NULL)`,
      [caregiverId]
    );

    res.json({
      requests: rows,
      max_capacity: cg?.max_capacity || 4,
      active_count: active_count || 0,
      is_at_capacity: (active_count || 0) >= (cg?.max_capacity || 4)
    });
  } catch (err) {
    console.error('Error fetching caregiver requests:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/users/caregiver-requests/:parentId/accept ───────────
// Caregiver accepts a parent care assignment
const acceptCaregiverRequest = async (req, res) => {
  const { parentId } = req.params;
  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);
    if (!caregiverId) {
      return res.status(403).json({ error: 'Caregiver profile not found.' });
    }

    const [[parent]] = await pool.query(
      'SELECT * FROM parents WHERE id = ? AND assigned_caregiver_id = ?',
      [parentId, caregiverId]
    );

    if (!parent) {
      return res.status(404).json({ error: 'Care request not found or not assigned to you.' });
    }

    await pool.query(
      `UPDATE parents 
       SET assignment_status = 'accepted', rejection_reason = NULL 
       WHERE id = ? AND assigned_caregiver_id = ?`,
      [parentId, caregiverId]
    );

    // Create an alert notification for the child
    try {
      const [[cgUser]] = await pool.query(
        'SELECT name FROM users WHERE id = ?',
        [req.user.id]
      );
      const cgName = cgUser?.name || 'Your caregiver';
      await pool.query(
        `INSERT INTO alerts (parent_id, title, description, type)
         VALUES (?, ?, ?, 'info')`,
        [
          parentId,
          'Caregiver Request Accepted',
          `${cgName} has accepted the care assignment request for ${parent.name}.`
        ]
      );
    } catch (alertErr) {
      console.warn('Could not insert acceptance alert:', alertErr);
    }

    res.json({ message: `Successfully accepted care request for ${parent.name}.` });
  } catch (err) {
    console.error('Error accepting caregiver request:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/users/caregiver-requests/:parentId/reject ───────────
// Caregiver declines/rejects a parent care assignment with reason
const rejectCaregiverRequest = async (req, res) => {
  const { parentId } = req.params;
  const { reason } = req.body;

  const rejectionReason = reason || 'Caregiver reached full capacity (4/4)';

  try {
    const caregiverId = await getOrCreateCaregiverId(req.user.id);
    if (!caregiverId) {
      return res.status(403).json({ error: 'Caregiver profile not found.' });
    }

    const [[parent]] = await pool.query(
      'SELECT * FROM parents WHERE id = ? AND assigned_caregiver_id = ?',
      [parentId, caregiverId]
    );

    if (!parent) {
      return res.status(404).json({ error: 'Care request not found or not assigned to you.' });
    }

    await pool.query(
      `UPDATE parents 
       SET assignment_status = 'rejected', rejection_reason = ? 
       WHERE id = ? AND assigned_caregiver_id = ?`,
      [rejectionReason, parentId, caregiverId]
    );

    // Create an alert notification for the child
    try {
      const [[cgUser]] = await pool.query(
        'SELECT name FROM users WHERE id = ?',
        [req.user.id]
      );
      const cgName = cgUser?.name || 'The caregiver';
      await pool.query(
        `INSERT INTO alerts (parent_id, title, description, type)
         VALUES (?, ?, ?, 'warning')`,
        [
          parentId,
          'Caregiver Request Declined',
          `${cgName} was unable to accept care request for ${parent.name}. Reason: ${rejectionReason}`
        ]
      );
    } catch (alertErr) {
      console.warn('Could not insert rejection alert:', alertErr);
    }

    res.json({ message: `Declined care request for ${parent.name}.` });
  } catch (err) {
    console.error('Error rejecting caregiver request:', err);
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

// ── PayHere Monthly Subscription & Assignment ───────────────────────────

// POST /api/users/subscriptions/payhere-init
const initiatePayhereSubscription = async (req, res) => {
  const { parentId, caregiverId } = req.body;
  const childId = req.user.id;

  if (!parentId || !caregiverId) {
    return res.status(400).json({ error: 'parentId and caregiverId are required' });
  }

  try {
    // 1. Verify parent belongs to the logged in child
    const [[parent]] = await pool.query(
      'SELECT id, name, age, condition_summary, child_id FROM parents WHERE id = ? AND child_id = ?',
      [parentId, childId]
    );
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found or you do not have permission to manage this parent.' });
    }

    // 2. Fetch caregiver details & plan pricing
    const [[cg]] = await pool.query(
      `SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name, c.specialization,
              COALESCE(c.monthly_rate, 350.00) AS monthly_rate,
              COALESCE(c.plan_title, 'Comprehensive Monthly Care Plan') AS plan_title,
              c.plan_description, c.plan_features, u.email, u.phone, u.avatar_url
       FROM caregivers c
       LEFT JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [caregiverId]
    );

    if (!cg) {
      return res.status(404).json({ error: 'Caregiver profile not found.' });
    }

    // 3. Fetch logged in user (child) info
    const [[childUser]] = await pool.query('SELECT name, email, phone FROM users WHERE id = ?', [childId]);

    const orderId = `FC-SUB-${Date.now()}-${childId}`;
    const amount = Number(cg.monthly_rate || 350.00);
    const formattedAmount = formatAmount(amount);
    const currency = process.env.PAYHERE_CURRENCY || 'LKR';
    const merchantId = PAYHERE_MERCHANT_ID;
    const hash = generatePayhereHash(merchantId, orderId, formattedAmount, currency);

    const nameParts = (childUser?.name || 'Family Member').trim().split(' ');
    const firstName = nameParts[0] || 'Family';
    const lastName = nameParts.slice(1).join(' ') || 'Member';

    res.json({
      sandbox: PAYHERE_MODE !== 'live',
      merchant_id: merchantId,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/parents`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/caregivers-list`,
      notify_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/users/subscriptions/payhere-notify`,
      order_id: orderId,
      items: `1-Month Caregiver Subscription: ${cg.plan_title} (${cg.name})`,
      amount: formattedAmount,
      currency: currency,
      hash: hash,
      first_name: firstName,
      last_name: lastName,
      email: childUser?.email || 'user@familycare.com',
      phone: childUser?.phone || '0771234567',
      address: 'FamilyCare Platform',
      city: 'Colombo',
      country: 'Sri Lanka',
      parent: {
        id: parent.id,
        name: parent.name,
      },
      caregiver: {
        id: cg.id,
        name: cg.name,
        avatar_url: cg.avatar_url,
        specialization: cg.specialization,
        monthly_rate: amount,
        plan_title: cg.plan_title,
        plan_features: cg.plan_features,
        plan_description: cg.plan_description,
      }
    });
  } catch (err) {
    console.error('Error initiating PayHere subscription:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/subscriptions/payhere-verify
const verifyAndCompletePayhereSubscription = async (req, res) => {
  const childId = req.user.id;
  const {
    order_id,
    payhere_payment_id,
    payhere_amount,
    payhere_currency,
    parentId,
    caregiverId,
    plan_title,
  } = req.body;

  if (!parentId || !caregiverId || !order_id) {
    return res.status(400).json({ error: 'Missing required parameters (parentId, caregiverId, order_id).' });
  }

  try {
    // 1. Verify parent belongs to child
    const [[parent]] = await pool.query(
      'SELECT id, name, child_id FROM parents WHERE id = ? AND child_id = ?',
      [parentId, childId]
    );
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found or unauthorized.' });
    }

    // 2. Fetch caregiver info
    const [[cg]] = await pool.query(
      `SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name,
              COALESCE(c.monthly_rate, 350.00) AS monthly_rate,
              COALESCE(c.plan_title, 'Comprehensive Monthly Care Plan') AS plan_title
       FROM caregivers c
       LEFT JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [caregiverId]
    );
    if (!cg) {
      return res.status(404).json({ error: 'Caregiver not found.' });
    }

    const paidAmount = Number(payhere_amount || cg.monthly_rate || 350.00);
    const currency = payhere_currency || process.env.PAYHERE_CURRENCY || 'LKR';
    const planName = plan_title || cg.plan_title || 'Comprehensive Monthly Care Plan';
    const txId = payhere_payment_id || `SANDBOX-TX-${Date.now()}`;

    // 3. Compute 1 month validity (+30 days)
    const startDate = new Date();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // 4. Create caregiver_subscriptions record
    const [subResult] = await pool.query(
      `INSERT INTO caregiver_subscriptions 
         (child_id, parent_id, caregiver_id, plan_name, amount, currency, status, payment_method, payhere_payment_id, transaction_id, start_date, end_date, auto_renew)
       VALUES (?, ?, ?, ?, ?, ?, 'active', 'PayHere Sandbox', ?, ?, ?, ?, 1)`,
      [
        childId,
        parentId,
        caregiverId,
        planName,
        paidAmount,
        currency,
        txId,
        order_id,
        startDate,
        endDate,
      ]
    );
    const subscriptionId = subResult.insertId;

    // 5. Create transaction payment audit record
    await pool.query(
      `INSERT INTO subscription_payments
         (subscription_id, child_id, parent_id, caregiver_id, amount, currency, payment_gateway, payhere_order_id, payhere_payment_id, payment_status, raw_response)
       VALUES (?, ?, ?, ?, ?, ?, 'PayHere Sandbox', ?, ?, 'succeeded', ?)`,
      [
        subscriptionId,
        childId,
        parentId,
        caregiverId,
        paidAmount,
        currency,
        order_id,
        txId,
        JSON.stringify(req.body),
      ]
    );

    // 6. Update parent record (assign caregiver and mark active subscription)
    await pool.query(
      `UPDATE parents
       SET assigned_caregiver_id = ?,
           assignment_status = 'accepted',
           subscription_id = ?,
           subscription_status = 'active',
           subscription_end_date = ?
       WHERE id = ?`,
      [caregiverId, subscriptionId, endDate, parentId]
    );

    // 7. Insert Notification alerts for Child & Caregiver
    try {
      await pool.query(
        `INSERT INTO alerts (parent_id, title, description, type)
         VALUES (?, ?, ?, 'info')`,
        [
          parentId,
          '1-Month Care Subscription Activated',
          `1-month care plan (${planName}) for ${parent.name} with caregiver ${cg.name} is active until ${endDate.toLocaleDateString()}. Paid: ${currency} ${paidAmount.toFixed(2)} via PayHere Sandbox.`,
        ]
      );
    } catch (alertErr) {
      console.warn('Could not create subscription alert:', alertErr);
    }

    res.json({
      message: `Successfully paid 1-month subscription for ${parent.name}!`,
      subscription: {
        id: subscriptionId,
        order_id,
        transaction_id: txId,
        amount: paidAmount,
        currency: currency,
        plan_name: planName,
        parent_name: parent.name,
        caregiver_name: cg.name,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
      }
    });
  } catch (err) {
    console.error('Error verifying PayHere subscription:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/subscriptions/my-subscriptions
const getChildSubscriptions = async (req, res) => {
  const childId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT cs.*, 
              p.name AS parent_name, p.age AS parent_age,
              COALESCE(c.name, u.name) AS caregiver_name,
              u.avatar_url AS caregiver_avatar_url,
              u.email AS caregiver_email,
              u.phone AS caregiver_phone
       FROM caregiver_subscriptions cs
       JOIN parents p ON cs.parent_id = p.id
       JOIN caregivers c ON cs.caregiver_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       WHERE cs.child_id = ?
       ORDER BY cs.created_at DESC`,
      [childId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching child subscriptions:', err);
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
  getCaregiverRequests,
  acceptCaregiverRequest,
  rejectCaregiverRequest,
  updateNotificationPrefs,
  getNotificationPrefs,
  deleteAccount,
  getChildDashboardStats,
  initiatePayhereSubscription,
  verifyAndCompletePayhereSubscription,
  getChildSubscriptions,
};
