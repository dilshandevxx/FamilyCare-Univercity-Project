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
  getAdminStats,
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getPendingCaregivers,
  approveCaregiver,
  rejectCaregiver,
  getAdminHealthLogs,
  getAdminAlerts,
  resolveAdminAlert,
  deleteAdminAlert,
  getAdminAnalytics,
  getAdminActivity,
  getAdminSettings,
  updateAdminSettings,
} = require('../controllers/adminController');

// All admin routes require a valid JWT + admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats',                          getAdminStats);

// Residents (elders)
router.get('/residents',                      getResidents);
router.post('/residents',                     addResident);
router.put('/residents/:id',                  updateResident);
router.put('/residents/:id/assign',           assignCaregiver);
router.delete('/residents/:id',               deleteResident);

// Caregivers — pending approval must come before /:id routes
router.get('/caregivers/pending',             getPendingCaregivers);
router.put('/caregivers/:id/approve',         approveCaregiver);
router.put('/caregivers/:id/reject',          rejectCaregiver);
router.get('/caregivers',                     getCaregiversList);

// Users
router.get('/users',                          getAllUsers);
router.post('/users',                         createUser);
router.put('/users/:id/role',                 updateUserRole);
router.delete('/users/:id',                   deleteUser);

// Health logs (admin view — all residents)
router.get('/health-logs',                    getAdminHealthLogs);

// Alerts (admin view — all residents, no child scoping)
router.get('/alerts',                         getAdminAlerts);
router.put('/alerts/:id/resolve',             resolveAdminAlert);
router.delete('/alerts/:id',                  deleteAdminAlert);

// Analytics
router.get('/analytics',                      getAdminAnalytics);

// Activity feed
router.get('/activity',                       getAdminActivity);

// Platform settings
router.get('/settings',                       getAdminSettings);
router.put('/settings',                       updateAdminSettings);

module.exports = router;
