const pool = require('../config/db');

// GET /api/health
const getLogs = async (req, res) => {
  const { parent_id } = req.query;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM health_logs WHERE parent_id = ? ORDER BY logged_at DESC',
      [parent_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/health
const addLog = async (req, res) => {
  const { parent_id, blood_pressure, heart_rate, temperature, notes, logged_by } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO health_logs (parent_id, blood_pressure, heart_rate, temperature, notes, logged_by) VALUES (?,?,?,?,?,?)',
      [parent_id, blood_pressure, heart_rate, temperature, notes, logged_by || req.user.id]
    );
    res.status(201).json({ id: result.insertId, message: 'Health log added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLogs, addLog };
