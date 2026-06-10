const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getContacts, getAllUsers, sendMessage, getMessages, markAsRead, getElderSidebar, deleteMessage } = require('../controllers/messageController');

// NOTE: static routes (/contacts, /all-users, /elder-sidebar) must come BEFORE /:otherUserId
router.post('/', protect, sendMessage);
router.get('/contacts', protect, getContacts);
router.get('/all-users', protect, getAllUsers);
router.get('/elder-sidebar/:elderId', protect, getElderSidebar);
router.get('/:otherUserId', protect, getMessages);
router.put('/:otherUserId/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
