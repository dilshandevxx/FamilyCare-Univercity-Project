const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getResidents,
  addResident,
  assignCaregiver,
  updateResident,
  deleteResident,
  getCaregiversList,
} = require('../controllers/adminController');

// All admin routes require a valid JWT + admin role
router.use(protect, adminOnly);

// Residents (elders)
router.get('/residents',              getResidents);
router.post('/residents',             addResident);
router.put('/residents/:id',          updateResident);
router.put('/residents/:id/assign',   assignCaregiver);
router.delete('/residents/:id',       deleteResident);

// Caregivers list (for assignment dropdown)
router.get('/caregivers',             getCaregiversList);

module.exports = router;
