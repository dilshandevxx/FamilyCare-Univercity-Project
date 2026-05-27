const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAlerts, resolveAlert } = require('../controllers/alertController');

// All alert routes are protected with JWT auth
router.get('/', protect, getAlerts);
router.put('/:id/resolve', protect, resolveAlert);

module.exports = router;
