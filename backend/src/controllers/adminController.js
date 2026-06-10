const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// ── GET /api/admin/residents ─────────────────────────────────────
// All residents (parents) with their assigned caregiver name + user info
const getResidents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         p.id, p.name, p.age, p.medical_conditions,
         p.room_number, p.care_status, p.assigned_caregiver_id,
         c.id          AS caregiver_id,
         u.name        AS caregiver_name,
         u.email       AS caregiver_email,
         owner.name    AS family_name
       FROM parents p
       LEFT JOIN caregivers c  ON c.id   = p.assigned_caregiver_id
       LEFT JOIN users u       ON u.id   = c.user_id
       LEFT JOIN users owner   ON owner.id = p.child_id
       ORDER BY p.name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/admin/residents ────────────────────────────────────
// Create a new resident (elder)
const addResident = async (req, res) => {
  const {
    name, age, medical_conditions,
    room_number, care_status,
    assigned_caregiver_id,
    child_id,           // family member (owner) user id
  } = req.body;

  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    // child_id defaults to the admin's id if not provided
    const owner = child_id || req.user.id;

    const [result] = await pool.query(
      `INSERT INTO parents
         (child_id, name, age, medical_conditions, room_number, care_status, assigned_caregiver_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        owner,
        name,
        age                   || null,
        medical_conditions    || null,
        room_number           || null,
        care_status           || 'STABLE',
        assigned_caregiver_id || null,
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Resident added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/admin/residents/:id/assign ─────────────────────────
// Assign (or unassign) a caregiver to a resident
const assignCaregiver = async (req, res) => {
  const { caregiver_id } = req.body;   // null = unassign
  const { id } = req.params;

  try {
    await pool.query(
      'UPDATE parents SET assigned_caregiver_id = ? WHERE id = ?',
      [caregiver_id || null, id]
    );
    res.json({ message: 'Caregiver assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/admin/residents/:id ─────────────────────────────────
// Update resident details (name, age, conditions, room, status)
const updateResident = async (req, res) => {
  const { name, age, medical_conditions, room_number, care_status } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE parents
         SET name=?, age=?, medical_conditions=?, room_number=?, care_status=?
       WHERE id=?`,
      [name, age || null, medical_conditions || null, room_number || null, care_status || 'STABLE', id]
    );
    res.json({ message: 'Resident updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/admin/residents/:id ─────────────────────────────
const deleteResident = async (req, res) => {
  try {
    await pool.query('DELETE FROM parents WHERE id = ?', [req.params.id]);
    res.json({ message: 'Resident deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/caregivers ────────────────────────────────────
// All caregivers with their linked user info (for assignment dropdown)
const getCaregiversList = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.specialization, c.is_available,
              u.email, u.name AS user_name,
              COUNT(p.id) AS resident_count
       FROM caregivers c
       LEFT JOIN users u    ON u.id  = c.user_id
       LEFT JOIN parents p  ON p.assigned_caregiver_id = c.id
       GROUP BY c.id
       ORDER BY c.name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/stats ─────────────────────────────────────────
// Overall numbers shown on the admin dashboard
const getAdminStats = async (req, res) => {
  try {
    const [[{ total_users }]]     = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_caregivers }]] = await pool.query('SELECT COUNT(*) AS total_caregivers FROM caregivers');
    const [[{ total_elders }]]    = await pool.query('SELECT COUNT(*) AS total_elders FROM parents');
    const [[{ logs_today }]]      = await pool.query(
      "SELECT COUNT(*) AS logs_today FROM health_logs WHERE DATE(logged_at) = CURDATE()"
    );
    const [[{ active_alerts }]]   = await pool.query(
      "SELECT COUNT(*) AS active_alerts FROM alerts WHERE is_resolved = 0"
    );
    const [[{ critical_alerts }]] = await pool.query(
      "SELECT COUNT(*) AS critical_alerts FROM alerts WHERE is_resolved = 0 AND type = 'critical'"
    );
    const [[{ pending_approvals }]] = await pool.query(
      "SELECT COUNT(*) AS pending_approvals FROM caregivers WHERE status = 'pending'"
    );

    res.json({
      total_users,
      total_caregivers,
      total_elders,
      logs_today,
      active_alerts,
      critical_alerts,
      pending_approvals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/users ─────────────────────────────────────────
// All registered users with optional search
const getAllUsers = async (req, res) => {
  const { search = '' } = req.query;
  try {
    let query = `
      SELECT id, name, email, role, created_at
      FROM users
    `;
    const params = [];
    if (search.trim()) {
      query += ' WHERE name LIKE ? OR email LIKE ?';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }
    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/admin/users ────────────────────────────────────────
// Admin-created user (skips email-verification flow)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const allowed = ['child', 'caregiver', 'admin'];
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
  if (!allowed.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(422).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );

    if (role === 'caregiver') {
      await pool.query(
        "INSERT IGNORE INTO caregivers (user_id, name, status) VALUES (?, ?, 'approved')",
        [result.insertId, name]
      );
    }

    res.status(201).json({ id: result.insertId, name, email, role, message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/admin/users/:id/role ────────────────────────────────
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const allowed = ['child', 'caregiver', 'admin'];
  if (!allowed.includes(role))
    return res.status(400).json({ error: 'Invalid role. Must be child, caregiver, or admin.' });

  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'User role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/admin/users/:id ──────────────────────────────────
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (parseInt(id, 10) === req.user.id)
    return res.status(400).json({ error: 'You cannot delete your own account' });

  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/caregivers/pending ────────────────────────────
// Caregivers awaiting approval — full profile fields for View Docs modal
const getPendingCaregivers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         c.id, c.name, c.specialization, c.experience_years,
         c.certification, c.license_id, c.bio, c.hourly_rate,
         c.is_available, c.created_at,
         u.email, u.name AS user_name, u.created_at AS registered_at
       FROM caregivers c
       LEFT JOIN users u ON u.id = c.user_id
       WHERE c.status = 'pending'
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/admin/caregivers/:id/approve ───────────────────────
const approveCaregiver = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE caregivers SET status = 'approved' WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Caregiver not found' });
    res.json({ message: 'Caregiver approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/admin/caregivers/:id/reject ────────────────────────
const rejectCaregiver = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE caregivers SET status = 'rejected' WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Caregiver not found' });
    res.json({ message: 'Caregiver rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/health-logs ───────────────────────────────────
// All health logs across all residents with optional filters
const getAdminHealthLogs = async (req, res) => {
  const { search = '', flag = 'All', limit = 150 } = req.query;

  // Map UI flag labels to overall_condition values
  const conditionMap = { Critical: 'CRITICAL', Warning: 'NEEDS ATTENTION', Normal: 'STABLE' };

  try {
    let query = `
      SELECT
        hl.id, hl.logged_at,
        hl.blood_pressure, hl.heart_rate, hl.temperature,
        hl.meds_taken, hl.meds_notes, hl.clinical_notes,
        hl.mood, hl.overall_condition, hl.notes,
        hl.breakfast_status, hl.lunch_status, hl.dinner_status,
        p.name AS elder_name,
        u.name AS caregiver_name
      FROM health_logs hl
      LEFT JOIN parents p ON p.id = hl.parent_id
      LEFT JOIN users   u ON u.id = hl.logged_by
    `;
    const params = [];
    const conditions = [];

    if (search.trim()) {
      conditions.push('(p.name LIKE ? OR u.name LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }
    if (flag && flag !== 'All' && conditionMap[flag]) {
      conditions.push('hl.overall_condition = ?');
      params.push(conditionMap[flag]);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY hl.logged_at DESC LIMIT ?';
    params.push(Number(limit));

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/alerts ────────────────────────────────────────
// All alerts across all residents (admin view — no child_id scoping)
// Also backfills any CRITICAL/WARNING health logs that have no alert yet.
const getAdminAlerts = async (req, res) => {
  try {
    // Auto-backfill: create alerts for CRITICAL/NEEDS ATTENTION logs with no matching alert
    await pool.query(`
      INSERT INTO alerts (parent_id, title, description, type, created_at)
      SELECT
        hl.parent_id,
        CONCAT(IF(hl.overall_condition = 'CRITICAL', 'Critical', 'Warning'),
               ' condition logged for ', p.name),
        CONCAT_WS(' · ',
          IF(hl.blood_pressure IS NOT NULL AND hl.blood_pressure != '',
             CONCAT('BP: ', hl.blood_pressure), NULL),
          IF(hl.heart_rate IS NOT NULL AND hl.heart_rate != '',
             CONCAT('HR: ', hl.heart_rate, ' bpm'), NULL),
          IF(hl.temperature IS NOT NULL AND hl.temperature != '',
             CONCAT('Temp: ', hl.temperature, '°'), NULL)
        ),
        IF(hl.overall_condition = 'CRITICAL', 'critical', 'warning'),
        hl.logged_at
      FROM health_logs hl
      JOIN parents p ON p.id = hl.parent_id
      WHERE hl.overall_condition IN ('CRITICAL', 'NEEDS ATTENTION')
        AND NOT EXISTS (
          SELECT 1 FROM alerts a
          WHERE a.parent_id = hl.parent_id
            AND ABS(TIMESTAMPDIFF(SECOND, a.created_at, hl.logged_at)) < 120
        )
    `).catch(() => {}); // silently skip if overall_condition column not yet migrated

    const [rows] = await pool.query(`
      SELECT a.*, p.name AS elder_name
      FROM alerts a
      LEFT JOIN parents p ON p.id = a.parent_id
      ORDER BY a.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/admin/alerts/:id/resolve ───────────────────────────
const resolveAdminAlert = async (req, res) => {
  try {
    await pool.query('UPDATE alerts SET is_resolved = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Alert resolved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/admin/alerts/:id ────────────────────────────────
const deleteAdminAlert = async (req, res) => {
  try {
    await pool.query('DELETE FROM alerts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/analytics ─────────────────────────────────────
// Aggregated analytics for the analytics page
const getAdminAnalytics = async (req, res) => {
  try {
    // Monthly user signups — last 6 months
    const [monthlyUsers] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%b') AS month,
        DATE_FORMAT(created_at, '%Y-%m') AS month_key,
        COUNT(*) AS users
      FROM users
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month_key, month
      ORDER BY month_key ASC
    `);

    // Health log counts by type (overall_condition used as proxy type)
    const [logsByCondition] = await pool.query(`
      SELECT overall_condition AS type, COUNT(*) AS count
      FROM health_logs
      WHERE overall_condition IS NOT NULL AND overall_condition != ''
      GROUP BY overall_condition
      ORDER BY count DESC
      LIMIT 6
    `);

    // KPI stats
    const [[{ total_users }]]       = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_caregivers }]]  = await pool.query("SELECT COUNT(*) AS total_caregivers FROM caregivers WHERE status='approved'");
    const [[{ logs_this_month }]]   = await pool.query(
      "SELECT COUNT(*) AS logs_this_month FROM health_logs WHERE MONTH(logged_at)=MONTH(CURDATE()) AND YEAR(logged_at)=YEAR(CURDATE())"
    );
    const [[{ logs_last_month }]]   = await pool.query(
      "SELECT COUNT(*) AS logs_last_month FROM health_logs WHERE MONTH(logged_at)=MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH)) AND YEAR(logged_at)=YEAR(DATE_SUB(CURDATE(),INTERVAL 1 MONTH))"
    );
    const [[{ logs_today }]]        = await pool.query(
      "SELECT COUNT(*) AS logs_today FROM health_logs WHERE DATE(logged_at)=CURDATE()"
    );

    // Monthly growth % vs last month user count
    const [[{ users_this_month }]]  = await pool.query(
      "SELECT COUNT(*) AS users_this_month FROM users WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())"
    );
    const [[{ users_last_month }]]  = await pool.query(
      "SELECT COUNT(*) AS users_last_month FROM users WHERE MONTH(created_at)=MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH)) AND YEAR(created_at)=YEAR(DATE_SUB(CURDATE(),INTERVAL 1 MONTH))"
    );

    const growthPct = users_last_month > 0
      ? Math.round(((users_this_month - users_last_month) / users_last_month) * 100)
      : 0;

    res.json({
      kpis: {
        total_users,
        active_caregivers: total_caregivers,
        logs_today,
        monthly_growth_pct: growthPct,
        logs_this_month,
        logs_last_month,
      },
      monthly_users: monthlyUsers,
      logs_by_condition: logsByCondition,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/activity ──────────────────────────────────────
// Recent platform-wide activity feed for the dashboard
const getAdminActivity = async (req, res) => {
  try {
    const events = [];

    // Recent user registrations
    const [newUsers] = await pool.query(
      `SELECT id, name, role, created_at AS ts FROM users ORDER BY created_at DESC LIMIT 5`
    );
    newUsers.forEach(u => events.push({
      type: 'user_registered', icon: 'UserPlus',
      title: `New ${u.role} registered`,
      desc: `${u.name} joined the platform`,
      ts: u.ts,
    }));

    // Recent health logs
    const [logs] = await pool.query(`
      SELECT hl.logged_at AS ts, u.name AS caregiver, p.name AS elder, hl.overall_condition
      FROM health_logs hl
      LEFT JOIN users   u ON u.id = hl.logged_by
      LEFT JOIN parents p ON p.id = hl.parent_id
      ORDER BY hl.logged_at DESC LIMIT 5
    `);
    logs.forEach(l => events.push({
      type: 'health_log', icon: 'Activity',
      title: 'Health log submitted',
      desc: `${l.caregiver || 'Caregiver'} logged for ${l.elder || 'resident'}`,
      ts: l.ts,
    }));

    // Recent alerts
    const [alerts] = await pool.query(
      `SELECT id, title, type, created_at AS ts FROM alerts ORDER BY created_at DESC LIMIT 5`
    );
    alerts.forEach(a => events.push({
      type: 'alert', icon: a.type === 'critical' ? 'AlertTriangle' : 'Bell',
      title: `Alert: ${a.title || 'Health alert'}`,
      desc: `${a.type === 'critical' ? 'Critical' : 'Warning'} alert triggered`,
      ts: a.ts,
    }));

    // Recent caregiver approvals
    const [approved] = await pool.query(`
      SELECT c.id, u.name, c.updated_at AS ts
      FROM caregivers c LEFT JOIN users u ON u.id = c.user_id
      WHERE c.status = 'approved'
      ORDER BY c.updated_at DESC LIMIT 3
    `);
    approved.forEach(c => events.push({
      type: 'caregiver_approved', icon: 'UserCheck',
      title: 'Caregiver approved',
      desc: `${c.name || 'Caregiver'} has been approved`,
      ts: c.ts,
    }));

    // Sort all events by timestamp desc, return top 10
    events.sort((a, b) => new Date(b.ts) - new Date(a.ts));
    res.json(events.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/settings ──────────────────────────────────────
const getAdminSettings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM admin_settings"
    );
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
  } catch (err) {
    // Table may not exist yet — return defaults
    res.json({});
  }
};

// ── PUT /api/admin/settings ──────────────────────────────────────
const updateAdminSettings = async (req, res) => {
  const entries = Object.entries(req.body);
  if (!entries.length) return res.status(400).json({ error: 'No settings provided' });
  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        setting_key   VARCHAR(100) PRIMARY KEY,
        setting_value TEXT,
        updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(value)]
      );
    }
    res.json({ message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getResidents,
  addResident,
  assignCaregiver,
  updateResident,
  deleteResident,
  getCaregiversList,
  getAdminStats,
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getPendingCaregivers,
  approveCaregiver,
  rejectCaregiver,
  getAdminHealthLogs,
  getAdminAlerts,
  resolveAdminAlert,
  deleteAdminAlert,
  getAdminAnalytics,
  getAdminActivity,
  getAdminSettings,
  updateAdminSettings,
};
