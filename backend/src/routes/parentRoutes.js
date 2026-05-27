const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createParent, getParents } = require('../controllers/parentController');

// All parent routes are protected with JWT auth
router.post('/', protect, createParent);
router.get('/', protect, getParents);

module.exports = router;
