const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createParent, getParents, assignCaregiver } = require('../controllers/parentController');

// All parent routes are protected with JWT auth
router.post('/', protect, createParent);
router.get('/', protect, getParents);
router.put('/:id/assign', protect, assignCaregiver);

module.exports = router;
