const pool = require('../config/db');

// ── GET /api/health?parent_id=X ──────────────────────────────────
// All logs for a resident (most recent first)
const getLogs = async (req, res) => {
  const { parent_id } = req.query;
  if (!parent_id) return res.status(400).json({ error: 'parent_id is required' });
  try {
    const [rows] = await pool.query(
      `SELECT hl.*,
              u.name AS logged_by_name
       FROM health_logs hl
       LEFT JOIN users u ON u.id = hl.logged_by
       WHERE hl.parent_id = ?
       ORDER BY hl.logged_at DESC`,
      [parent_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/health ─────────────────────────────────────────────
// Submit a full health log entry (supports file attachment via multipart)
const addLog = async (req, res) => {
  const {
    parent_id,
    logged_at,           // optional custom datetime (ISO string)
    blood_pressure,
    heart_rate,
    temperature,
    meal_status,         // legacy / overall meal field kept for compatibility
    breakfast_status,
    lunch_status,
    dinner_status,
    meds_taken,
    meds_notes,
    clinical_notes,
    mood,
    overall_condition,
    notes,               // general notes field
  } = req.body;

  if (!parent_id) return res.status(400).json({ error: 'parent_id is required' });

  // File attachment uploaded via multipart/form-data
  const attachment_url = req.file
    ? `/uploads/health-attachments/${req.file.filename}`
    : null;

  // Normalise booleans that arrive as strings from FormData
  const medsTakenVal =
    meds_taken === true || meds_taken === 'true' ? 1
    : meds_taken === false || meds_taken === 'false' ? 0
    : null;

  try {
    // ── Step 1: Safe INSERT using only original schema columns ────
    // These columns are guaranteed to exist (schema.sql + add_resident_fields.sql).
    // This works even if add_health_log_fields.sql migration has NOT been run yet.
    const loggedAtValue = logged_at || null; // null → MySQL uses DEFAULT CURRENT_TIMESTAMP

    const [result] = await pool.query(
      `INSERT INTO health_logs
         (parent_id, blood_pressure, heart_rate, temperature, meal_status, notes, logged_by${loggedAtValue ? ', logged_at' : ''})
       VALUES (?,?,?,?,?,?,?${loggedAtValue ? ',?' : ''})`,
      [
        parent_id,
        blood_pressure || null,
        heart_rate     || null,
        temperature    || null,
        meal_status    || null,
        notes          || clinical_notes || null,
        req.user.id,
        ...(loggedAtValue ? [loggedAtValue] : []),
      ]
    );

    const newId = result.insertId;

    // ── Step 2: Extended fields UPDATE (requires migration) ───────
    // Silently skip if the columns don't exist yet.
    try {
      await pool.query(
        `UPDATE health_logs SET
           breakfast_status  = ?,
           lunch_status      = ?,
           dinner_status     = ?,
           meds_taken        = ?,
           meds_notes        = ?,
           clinical_notes    = ?,
           mood              = ?,
           overall_condition = ?,
           attachment_url    = ?
         WHERE id = ?`,
        [
          breakfast_status  || 'Pending',
          lunch_status      || 'Pending',
          dinner_status     || 'Pending',
          medsTakenVal,
          meds_notes        || null,
          clinical_notes    || null,
          mood              || null,
          overall_condition || 'STABLE',
          attachment_url,
          newId,
        ]
      );
    } catch (_extErr) {
      // Extended columns not yet available — run add_health_log_fields.sql migration
      console.warn('[health] Extended columns missing — run add_health_log_fields.sql');
    }

    // ── Step 3: Sync parents.care_status with overall_condition ──
    if (overall_condition) {
      try {
        await pool.query(
          'UPDATE parents SET care_status = ? WHERE id = ?',
          [overall_condition.toUpperCase(), parent_id]
        );
      } catch (_) {}
    }

    res.status(201).json({
      id:      newId,
      message: 'Health log added successfully',
    });
  } catch (err) {
    console.error('[addLog error]', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/health/resident/:id ─────────────────────────────────
// Resident profile card + last log summary + recent condition history
// Used by the right-hand sidebar in the Add Health Log page
const getResidentSummary = async (req, res) => {
  const { id } = req.params;
  try {
    // Resident profile
    const [[resident]] = await pool.query(
      `SELECT id, name, age, medical_conditions, room_number, care_status
       FROM parents WHERE id = ?`,
      [id]
    );
    if (!resident) return res.status(404).json({ error: 'Resident not found' });

    // Last health log
    const [[lastLog]] = await pool.query(
      `SELECT hl.*, u.name AS logged_by_name
       FROM health_logs hl
       LEFT JOIN users u ON u.id = hl.logged_by
       WHERE hl.parent_id = ?
       ORDER BY hl.logged_at DESC
       LIMIT 1`,
      [id]
    );

    // Recent condition history (last 5 logs)
    const [history] = await pool.query(
      `SELECT id, overall_condition, logged_at
       FROM health_logs
       WHERE parent_id = ?
       ORDER BY logged_at DESC
       LIMIT 5`,
      [id]
    );

    res.json({ resident, lastLog: lastLog || null, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/health/resident/:id/logs ────────────────────────────
// Paginated full log history for a resident
const getResidentLogs = async (req, res) => {
  const { id } = req.params;
  const page  = parseInt(req.query.page  || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.query(
      `SELECT hl.*, u.name AS logged_by_name
       FROM health_logs hl
       LEFT JOIN users u ON u.id = hl.logged_by
       WHERE hl.parent_id = ?
       ORDER BY hl.logged_at DESC
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM health_logs WHERE parent_id = ?',
      [id]
    );

    res.json({ logs: rows, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/health/:logId ───────────────────────────────────────
// Single log entry (for view / edit)
const getLogById = async (req, res) => {
  try {
    const [[log]] = await pool.query(
      `SELECT hl.*, u.name AS logged_by_name
       FROM health_logs hl
       LEFT JOIN users u ON u.id = hl.logged_by
       WHERE hl.id = ?`,
      [req.params.logId]
    );
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLogs, addLog, getResidentSummary, getResidentLogs, getLogById };
