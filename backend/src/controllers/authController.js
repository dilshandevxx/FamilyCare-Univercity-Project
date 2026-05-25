const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Maps frontend role names to DB ENUM values
const ROLE_MAP = { family: 'child', caregiver: 'caregiver', admin: 'admin' };

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const dbRole = ROLE_MAP[role] || 'child';
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(422).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, dbRole]
    );
    const token = jwt.sign({ id: result.insertId, role: dbRole }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.status(201).json({ message: 'User registered', token, role: dbRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Validate selected role matches the account's actual role
    if (role) {
      const expectedDbRole = ROLE_MAP[role];
      if (expectedDbRole && user.role !== expectedDbRole) {
        const roleLabel = role === 'family' ? 'Family Member' : role.charAt(0).toUpperCase() + role.slice(1);
        return res.status(403).json({ error: `This account is not registered as a ${roleLabel}. Please select the correct role.` });
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
