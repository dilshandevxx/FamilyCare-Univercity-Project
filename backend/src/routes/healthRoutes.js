const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getLogs, addLog } = require('../controllers/healthController');

router.get('/', protect, getLogs);
router.post('/', protect, addLog);

module.exports = router;
