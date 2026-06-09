const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAlerts, resolveAlert, deleteAlert, createAlert } = require('../controllers/alertController');

// All alert routes are protected with JWT auth
router.get('/',           protect, getAlerts);
router.post('/',          protect, createAlert);
router.put('/:id/resolve', protect, resolveAlert);
router.delete('/:id',     protect, deleteAlert);

module.exports = router;
