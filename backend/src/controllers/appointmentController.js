const pool = require('../config/db');

// GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM appointments WHERE child_id = ? OR caregiver_id = ? ORDER BY appointment_date DESC',
      [req.user.id, req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/appointments
const bookAppointment = async (req, res) => {
  const { parent_id, caregiver_id, appointment_date, notes } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO appointments (child_id, parent_id, caregiver_id, appointment_date, notes, status) VALUES (?,?,?,?,?,?)',
      [req.user.id, parent_id, caregiver_id, appointment_date, notes, 'pending']
    );
    res.status(201).json({ id: result.insertId, message: 'Appointment booked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAppointments, bookAppointment, updateAppointment };
