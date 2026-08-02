const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const crypto = require('crypto');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // nodemailer is optional
}
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

    // ── 2FA & Timeout Settings ───────────────────────────────────
    const [settingsRows] = await pool.query("SELECT * FROM settings WHERE k IN ('twoFactor', 'sessionTimeout')");
    let globalTwoFactor = false;
    let globalSessionTimeout = '30';
    settingsRows.forEach(r => {
      if (r.k === 'twoFactor') globalTwoFactor = (r.v === 'true');
      if (r.k === 'sessionTimeout') globalSessionTimeout = r.v;
    });

    const isCaregiverOrAdmin = user.role === 'admin' || user.role === 'caregiver';
    if (user.tfa_enabled || (globalTwoFactor && isCaregiverOrAdmin)) {
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
      expiresIn: `${globalSessionTimeout}m`,
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
    const [settingsRows] = await pool.query("SELECT * FROM settings WHERE k IN ('twoFactor', 'sessionTimeout')");
    let globalTwoFactor = false;
    let globalSessionTimeout = '30';
    settingsRows.forEach(r => {
      if (r.k === 'twoFactor') globalTwoFactor = (r.v === 'true');
      if (r.k === 'sessionTimeout') globalSessionTimeout = r.v;
    });

    const isCaregiverOrAdmin = user.role === 'admin' || user.role === 'caregiver';
    if (!user.tfa_secret && (!globalTwoFactor || !isCaregiverOrAdmin)) {
      return res.status(400).json({ error: '2FA is not set up for this account' });
    }
    
    // If globally enforced but they don't have a secret, they can't log in. They need to set it up.
    if (!user.tfa_secret) {
      return res.status(400).json({ error: '2FA is required by admin. Please contact support to set up your 2FA secret.' });
    }

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
      { expiresIn: `${globalSessionTimeout}m` }
    );
    res.json({ message: 'Login successful', token: fullToken, role: decoded.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const [rows] = await pool.query('SELECT id, name FROM users WHERE email = ?', [email]);

    // Always return success — don't reveal whether the email exists
    if (rows.length === 0) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [token, expires, user.id]
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;

    // Always log to console so it works in dev without email credentials
    console.log(`\n[PASSWORD RESET] ${user.name} <${email}>\n  Reset URL: ${resetUrl}\n`);

    // Send email only when credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"FamilyCare" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your FamilyCare password',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#ffffff;border-radius:12px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
              <div style="background:linear-gradient(135deg,#00C9B5,#00A896);width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center">
                <span style="color:white;font-weight:800;font-size:18px">F</span>
              </div>
              <span style="font-size:1.1rem;font-weight:700;color:#0f172a">FamilyCare</span>
            </div>
            <h2 style="color:#0f172a;margin:0 0 12px;font-size:1.35rem">Reset your password</h2>
            <p style="color:#64748b;line-height:1.6;margin:0 0 24px">
              Hi ${user.name},<br>
              We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#00C9B5,#00A896);color:white;padding:13px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:0.95rem;margin-bottom:24px">
              Reset Password
            </a>
            <p style="color:#94a3b8;font-size:0.82rem;margin:0;border-top:1px solid #e2e8f0;padding-top:16px">
              If you didn't request this, you can safely ignore this email. Your password won't change.
            </p>
          </div>
        `,
      });
    }

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
  if (password.length < 6)  return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired. Please request a new one.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashed, rows[0].id]
    );

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/google - Direct Google Identity Services (GIS) ID Token Verification
const googleAuth = async (req, res) => {
  const {
    credential,
    role,
    relationship,
    specialization,
    experience_years,
    certification,
    license_id,
    hourly_rate,
    bio,
  } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential token is required' });
  }

  try {
    let email, name, picture, googleId;

    // Check if it's a dev/mock token or quick local test
    if (credential.startsWith('dev_google_') || credential === 'dev_mock_credential') {
      const isCaregiver = role === 'caregiver' || req.body.role === 'caregiver';
      email = req.body.email || (isCaregiver ? 'caregiver.google@familycare.com' : 'family.google@familycare.com');
      name = req.body.name || (isCaregiver ? 'Dr. Sarah Mitchell (Google)' : 'Jane Cooper (Google)');
      picture = req.body.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      googleId = 'google_dev_' + Buffer.from(email).toString('hex').slice(0, 16);
    } else {
      // 1. Try Google tokeninfo endpoint (for ID tokens)
      try {
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        const googleData = await googleRes.json();

        if (googleRes.ok && googleData.email) {
          email = googleData.email;
          name = googleData.name;
          picture = googleData.picture;
          googleId = googleData.sub;
        }
      } catch (tokeninfoErr) {
        console.warn('Google tokeninfo fetch failed, attempting userinfo fallback:', tokeninfoErr.message);
      }

      // 2. If tokeninfo didn't resolve email, try userinfo endpoint (for access tokens)
      if (!email) {
        try {
          const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${credential}` },
          });
          const userinfoData = await userinfoRes.json();

          if (userinfoRes.ok && userinfoData.email) {
            email = userinfoData.email;
            name = userinfoData.name;
            picture = userinfoData.picture;
            googleId = userinfoData.sub;
          }
        } catch (userinfoErr) {
          console.warn('Google userinfo fetch failed:', userinfoErr.message);
        }
      }

      if (!email) {
        return res.status(401).json({ error: 'Invalid or expired Google authentication token. Please try again.' });
      }
    }

    const dbRole = ROLE_MAP[role] || (role === 'caregiver' ? 'caregiver' : 'child');

    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, googleId]);

    let user;
    if (existing.length > 0) {
      user = existing[0];

      // Update google_id and avatar if missing
      const updates = [];
      const params = [];
      if (!user.google_id && googleId) {
        updates.push('google_id = ?');
        params.push(googleId);
      }
      if (!user.avatar_url && picture) {
        updates.push('avatar_url = ?');
        params.push(picture);
      }
      if (!user.auth_provider || user.auth_provider === 'local') {
        updates.push('auth_provider = ?');
        params.push('google');
      }
      if (updates.length > 0) {
        params.push(user.id);
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
        const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ?', [user.id]);
        user = updatedRows[0];
      }

      // If user is caregiver, ensure row exists in caregivers table
      if (user.role === 'caregiver') {
        await pool.query(
          "INSERT IGNORE INTO caregivers (user_id, name, is_available, status) VALUES (?, ?, TRUE, 'approved')",
          [user.id, user.name]
        );
      }
    } else {
      // Create new user with Google details
      const [insertResult] = await pool.query(
        "INSERT INTO users (name, email, password, google_id, role, auth_provider, avatar_url) VALUES (?, ?, NULL, ?, ?, 'google', ?)",
        [name || email.split('@')[0], email, googleId, dbRole, picture || null]
      );

      const userId = insertResult.insertId;

      if (dbRole === 'child') {
        await pool.query(
          'INSERT INTO family_profiles (user_id, relationship) VALUES (?, ?)',
          [userId, relationship || 'Family Member']
        );
      } else if (dbRole === 'caregiver') {
        await pool.query(
          `INSERT INTO caregivers 
            (user_id, name, specialization, experience_years, certification, license_id, hourly_rate, bio, is_available, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, 'approved')`,
          [
            userId,
            name || email.split('@')[0],
            specialization || 'General Elder Care',
            experience_years || '1-3 years',
            certification || 'Certified Caregiver',
            license_id || 'LIC-G-' + userId,
            hourly_rate ? parseFloat(hourly_rate) : 25.00,
            bio || 'Dedicated professional caregiver committed to high quality care and wellness.',
          ]
        );
      }

      const [newRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      user = newRows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'familycare_super_secret_jwt_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Google authentication successful',
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: 'Failed to authenticate with Google: ' + err.message });
  }
};

module.exports = { register, login, validate2FA, forgotPassword, resetPassword, googleAuth };

