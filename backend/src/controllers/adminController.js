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

module.exports = {
  getResidents,
  addResident,
  assignCaregiver,
  updateResident,
  deleteResident,
  getCaregiversList,
};
