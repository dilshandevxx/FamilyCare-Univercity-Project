const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAppointments,
  bookAppointment,
  updateAppointment,
} = require('../controllers/appointmentController');

router.get('/', protect, getAppointments);
router.post('/', protect, bookAppointment);
router.put('/:id', protect, updateAppointment);

module.exports = router;
