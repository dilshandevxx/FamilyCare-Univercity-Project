const pool = require('../config/db');

// GET /api/caregivers/public - no auth required
const getPublicCaregivers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, u.avatar_url
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/caregivers/public/:id - no auth required
const getPublicCaregiverById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, u.avatar_url, u.email, u.phone
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Caregiver not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/caregivers
const getCaregivers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM caregivers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/caregivers/:id
const getCaregiverById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM caregivers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Caregiver not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/caregivers
const createCaregiver = async (req, res) => {
  const { name, specialization, experience_years, hourly_rate, bio } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO caregivers (name, specialization, experience_years, hourly_rate, bio) VALUES (?, ?, ?, ?, ?)',
      [name, specialization, experience_years, hourly_rate, bio]
    );
    res.status(201).json({ id: result.insertId, message: 'Caregiver created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/caregivers/:id
const updateCaregiver = async (req, res) => {
  const { name, specialization, experience_years, hourly_rate, bio } = req.body;
  try {
    await pool.query(
      'UPDATE caregivers SET name=?, specialization=?, experience_years=?, hourly_rate=?, bio=? WHERE id=?',
      [name, specialization, experience_years, hourly_rate, bio, req.params.id]
    );
    res.json({ message: 'Caregiver updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPublicCaregivers, getPublicCaregiverById, getCaregivers, getCaregiverById, createCaregiver, updateCaregiver };
