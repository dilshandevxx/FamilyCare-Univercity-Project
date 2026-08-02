const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const pool = require('./db');
const jwt = require('jsonwebtoken');

const findOrCreateOAuthUser = async (profile, provider, requestedRole = 'child') => {
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName || profile.username || email;
  const avatar = profile.photos?.[0]?.value || null;
  const googleId = profile.id || null;

  if (!email) throw new Error('No email returned from OAuth provider');

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, googleId]);

  if (rows.length > 0) {
    const user = rows[0];
    if (!user.google_id && googleId) {
      await pool.query('UPDATE users SET google_id = ?, auth_provider = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?', [googleId, provider, avatar, user.id]);
    }
    if (user.role === 'caregiver') {
      await pool.query(
        'INSERT IGNORE INTO caregivers (user_id, name, is_available, status) VALUES (?, ?, TRUE, "approved")',
        [user.id, user.name]
      );
    }
    return user;
  }

  const role = (requestedRole === 'caregiver' || requestedRole === 'caregiver') ? 'caregiver' : 'child';
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, google_id, role, auth_provider, avatar_url) VALUES (?, ?, NULL, ?, ?, ?, ?)',
    [name, email, googleId, role, provider, avatar]
  );
  const userId = result.insertId;

  if (role === 'child') {
    await pool.query('INSERT IGNORE INTO family_profiles (user_id, relationship) VALUES (?, ?)', [userId, 'Family Member']);
  } else if (role === 'caregiver') {
    await pool.query(
      `INSERT IGNORE INTO caregivers 
        (user_id, name, specialization, experience_years, certification, license_id, hourly_rate, bio, is_available, status)
       VALUES (?, ?, 'General Elder Care', '1-3 years', NULL, NULL, 25.00, 'Dedicated professional caregiver committed to high quality care and wellness.', TRUE, 'pending')`,
      [userId, name]
    );
  }

  const [newRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  return newRows[0];
};

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    scope: ['profile', 'email'],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const stateRole = req.query.state || req.session?.role || 'child';
      const user = await findOrCreateOAuthUser(profile, 'google', stateRole);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/github/callback`,
    scope: ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser(profile, 'github');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = { passport, generateToken };
