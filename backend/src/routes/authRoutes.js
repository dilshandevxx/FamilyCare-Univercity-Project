const express = require('express');
const router = express.Router();
const { register, login, validate2FA } = require('../controllers/authController');
const { passport, generateToken } = require('../config/passport');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

router.post('/register', register);
router.post('/login', login);
router.post('/2fa/validate', validate2FA);

// ── Google OAuth ──────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${CLIENT_URL}/oauth/callback?token=${token}&role=${req.user.role}`);
  }
);

// ── GitHub OAuth ──────────────────────────────────────────────
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${CLIENT_URL}/oauth/callback?token=${token}&role=${req.user.role}`);
  }
);

module.exports = router;
