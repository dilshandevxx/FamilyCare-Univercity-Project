const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getLogs, addLog, getHealthFeed } = require('../controllers/healthController');

router.get('/', protect, getLogs);
router.post('/', protect, addLog);
router.get('/feed', protect, getHealthFeed);

module.exports = router;
