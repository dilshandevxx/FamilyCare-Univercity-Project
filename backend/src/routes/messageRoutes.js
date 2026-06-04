const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages, getContacts } = require('../controllers/messageController');

// All chat routes are protected with JWT auth
router.post('/', protect, sendMessage);
router.get('/contacts', protect, getContacts);
router.get('/:otherUserId', protect, getMessages);

module.exports = router;
