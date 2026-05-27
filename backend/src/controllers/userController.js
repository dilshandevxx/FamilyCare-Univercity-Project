const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
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
  const { name, email, currentPassword, newPassword } = req.body;

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
    const updatedName = name || user.name;
    const updatedEmail = email || user.email;

    if (hashedPassword) {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [updatedName, updatedEmail, hashedPassword, req.user.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [updatedName, updatedEmail, req.user.id]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
