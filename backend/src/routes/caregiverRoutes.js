const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPublicCaregivers,
  getPublicCaregiverById,
  getCaregivers,
  getCaregiverById,
  createCaregiver,
  updateCaregiver,
} = require('../controllers/caregiverController');

router.get('/public', getPublicCaregivers);
router.get('/public/:id', getPublicCaregiverById);
router.get('/', protect, getCaregivers);
router.get('/:id', protect, getCaregiverById);
router.post('/', protect, createCaregiver);
router.put('/:id', protect, updateCaregiver);

module.exports = router;
