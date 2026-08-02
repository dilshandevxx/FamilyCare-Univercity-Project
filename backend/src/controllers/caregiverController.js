const pool = require('../config/db');

// GET /api/caregivers/public - no auth required
// ⚠️  Only returns APPROVED caregivers — pending/rejected are never exposed publicly
const getPublicCaregivers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, c.status,
             COALESCE(c.max_capacity, 4) AS max_capacity,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)) AS active_residents,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND p.assignment_status = 'pending') AS pending_requests,
             u.avatar_url, u.email, u.phone
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.status = 'approved'
      ORDER BY c.rating DESC, c.id DESC
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
      SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, c.status,
             COALESCE(c.max_capacity, 4) AS max_capacity,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)) AS active_residents,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND p.assignment_status = 'pending') AS pending_requests,
             u.avatar_url, u.email, u.phone
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

// GET /api/caregivers  (authenticated — used by child dashboard & assignment)
// ⚠️  Only returns APPROVED caregivers — pending/rejected never shown to children
const getCaregivers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.user_id, COALESCE(c.name, u.name) AS name, c.specialization, c.experience_years,
             c.certification, c.license_id, c.hourly_rate, c.bio,
             c.is_available, c.rating, c.total_reviews,
             c.location, c.languages, c.status,
             COALESCE(c.max_capacity, 4) AS max_capacity,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND (p.assignment_status = 'accepted' OR p.assignment_status IS NULL)) AS active_residents,
             (SELECT COUNT(*) FROM parents p WHERE p.assigned_caregiver_id = c.id AND p.assignment_status = 'pending') AS pending_requests,
             u.avatar_url, u.email, u.phone
      FROM caregivers c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.status = 'approved'
      ORDER BY c.rating DESC, c.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /api/caregivers/:id
const getCaregiverById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COALESCE(c.name, u.name) AS name, u.avatar_url, u.email, u.phone 
       FROM caregivers c 
       LEFT JOIN users u ON u.id = c.user_id 
       WHERE c.id = ?`,
      [req.params.id]
    );
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

