const pool = require('../config/db');

// POST /api/parents
// Create a new parent profile
const createParent = async (req, res) => {
  const {
    name,
    age,
    gender,
    relationship,
    phone,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    medical_conditions,
    allergies,
    current_medications,
    assigned_caregiver_id
  } = req.body;

  const child_id = req.user.id; // Logged-in user's ID (family member / child)

  if (!name) {
    return res.status(400).json({ error: 'Parent name is required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO parents (
        child_id, name, age, gender, relationship, phone, address,
        emergency_contact_name, emergency_contact_phone,
        medical_conditions, allergies, current_medications, assigned_caregiver_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        child_id,
        name,
        age || null,
        gender || null,
        relationship || null,
        phone || null,
        address || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        medical_conditions || null,
        allergies || null,
        current_medications || null,
        assigned_caregiver_id || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Parent profile created successfully'
    });
  } catch (err) {
    console.error('Error creating parent:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/parents
// Get all parents associated with the logged-in family member
const getParents = async (req, res) => {
  const child_id = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT parents.*, caregivers.name AS caregiver_name 
       FROM parents 
       LEFT JOIN caregivers ON parents.assigned_caregiver_id = caregivers.id 
       WHERE parents.child_id = ?
       ORDER BY parents.created_at DESC`,
      [child_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching parents:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createParent,
  getParents
};
