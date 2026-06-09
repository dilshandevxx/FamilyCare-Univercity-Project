const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
  assignCaregiver
} = require('../controllers/parentController');

// All parent routes are protected with JWT auth
router.post('/',            protect, createParent);
router.get('/',             protect, getParents);
router.get('/:id',          protect, getParentById);
router.put('/:id',          protect, updateParent);
router.delete('/:id',       protect, deleteParent);
router.put('/:id/assign',   protect, assignCaregiver);

module.exports = router;
