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

  const child_id = req.user.id;

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

// GET /api/parents/:id
// Get a single parent by ID (must belong to logged-in child)
const getParentById = async (req, res) => {
  const { id } = req.params;
  const child_id = req.user.id;

  try {
    const [[parent]] = await pool.query(
      `SELECT parents.*, caregivers.name AS caregiver_name,
              caregivers.specialization AS caregiver_specialization,
              caregivers.phone AS caregiver_phone
       FROM parents
       LEFT JOIN caregivers ON parents.assigned_caregiver_id = caregivers.id
       WHERE parents.id = ? AND parents.child_id = ?`,
      [id, child_id]
    );

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    // Fetch recent health logs for this parent
    const [recentLogs] = await pool.query(
      `SELECT hl.*, u.name AS logged_by_name
       FROM health_logs hl
       LEFT JOIN users u ON u.id = hl.logged_by
       WHERE hl.parent_id = ?
       ORDER BY hl.logged_at DESC
       LIMIT 5`,
      [id]
    );

    // Fetch active (unresolved) alerts for this parent
    const [activeAlerts] = await pool.query(
      `SELECT * FROM alerts
       WHERE parent_id = ? AND is_resolved = 0
       ORDER BY created_at DESC
       LIMIT 3`,
      [id]
    );

    res.json({ parent, recentLogs, activeAlerts });
  } catch (err) {
    console.error('Error fetching parent by id:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/parents/:id
// Update a parent profile (only if it belongs to the logged-in child)
const updateParent = async (req, res) => {
  const { id } = req.params;
  const child_id = req.user.id;
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

  if (!name) {
    return res.status(400).json({ error: 'Parent name is required' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE parents SET
        name = ?, age = ?, gender = ?, relationship = ?, phone = ?, address = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?,
        medical_conditions = ?, allergies = ?, current_medications = ?,
        assigned_caregiver_id = ?
       WHERE id = ? AND child_id = ?`,
      [
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
        assigned_caregiver_id || null,
        id,
        child_id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Parent not found or access denied' });
    }

    res.json({ message: 'Parent profile updated successfully' });
  } catch (err) {
    console.error('Error updating parent:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/parents/:id
// Delete a parent profile (only if it belongs to the logged-in child)
const deleteParent = async (req, res) => {
  const { id } = req.params;
  const child_id = req.user.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM parents WHERE id = ? AND child_id = ?',
      [id, child_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Parent not found or access denied' });
    }

    res.json({ message: 'Parent profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting parent:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/parents/:id/assign
const assignCaregiver = async (req, res) => {
  const { id } = req.params;
  const { assigned_caregiver_id } = req.body;
  try {
    await pool.query(
      'UPDATE parents SET assigned_caregiver_id = ? WHERE id = ? AND child_id = ?',
      [assigned_caregiver_id || null, id, req.user.id]
    );
    res.json({ message: 'Caregiver assigned successfully' });
  } catch (err) {
    console.error('Error assigning caregiver:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
  assignCaregiver
};
