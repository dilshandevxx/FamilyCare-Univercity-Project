const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const pool = require('../config/db');

// Maps frontend role names to DB ENUM values
const ROLE_MAP = { family: 'child', caregiver: 'caregiver', admin: 'admin' };

// POST /api/auth/register
const register = async (req, res) => {
  const {
    name, email, password, phone, role,
    // Family-specific
    relationship,
    // Caregiver-specific
    specialization, experience_years, certification, license_id, hourly_rate, bio,
  } = req.body;

  const dbRole = ROLE_MAP[role] || 'child';

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(422).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, phone || null, dbRole]
    );

    const userId = result.insertId;

    if (dbRole === 'child') {
      // Save family profile with relationship
      await pool.query(
        'INSERT INTO family_profiles (user_id, relationship) VALUES (?, ?)',
        [userId, relationship || null]
      );
    }

    if (dbRole === 'caregiver') {
      // Save full caregiver profile — starts as 'pending' for admin approval
      await pool.query(
        `INSERT INTO caregivers 
          (user_id, name, specialization, experience_years, certification, license_id, hourly_rate, bio, is_available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          userId, name,
          specialization || null,
          experience_years || null,
          certification || null,
          license_id || null,
          hourly_rate ? parseFloat(hourly_rate) : 0.00,
          bio || null,
        ]
      );
    }

    const token = jwt.sign({ id: userId, role: dbRole }, process.env.JWT_SECRET, {
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

    // ── 2FA gate ─────────────────────────────────────────────────
    if (user.tfa_enabled) {
      // Issue a short-lived partial token — no access to protected routes
      const partialToken = jwt.sign(
        { id: user.id, role: user.role, partial: true },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );
      return res.json({ tfa_required: true, partial_token: partialToken });
    }

    // Ensure caregivers row exists (handles accounts created before this fix)
    if (user.role === 'caregiver') {
      await pool.query(
        'INSERT IGNORE INTO caregivers (user_id, name) VALUES (?, ?)',
        [user.id, user.name]
      );
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/2fa/validate
// Called after login when tfa_required is true
const validate2FA = async (req, res) => {
  const { partial_token, token: otpToken } = req.body;
  if (!partial_token || !otpToken)
    return res.status(400).json({ error: 'partial_token and token are required' });

  let decoded;
  try {
    decoded = jwt.verify(partial_token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Partial token is invalid or expired' });
  }
  if (!decoded.partial)
    return res.status(401).json({ error: 'Invalid partial token' });

  try {
    const [rows] = await pool.query(
      'SELECT tfa_secret, tfa_enabled, role FROM users WHERE id = ?',
      [decoded.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];
    if (!user.tfa_enabled || !user.tfa_secret)
      return res.status(400).json({ error: '2FA is not set up for this account' });

    const valid = speakeasy.totp.verify({
      secret: user.tfa_secret,
      encoding: 'base32',
      token: otpToken.replace(/\s/g, ''),
      window: 1,
    });
    if (!valid) return res.status(400).json({ error: 'Invalid OTP — please try again' });

    const fullToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ message: 'Login successful', token: fullToken, role: decoded.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, validate2FA };
