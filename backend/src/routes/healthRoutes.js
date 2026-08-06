const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const router   = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  getLogs,
  addLog,
  getResidentSummary,
  getResidentLogs,
  getLogById,
  getHealthFeed,
  getAnalytics,
  getVisitHistory,
  getVisitTrends,
  getEldersList,
  getChildDashboardStats
} = require('../controllers/healthController');

const { uploadHealthAttachment } = require('../config/cloudinary');

// ── Routes ────────────────────────────────────────────────────────

// Dashboard Stats for Child
router.get('/dashboard/child', protect, getChildDashboardStats);

// Visit history for the logged-in caregiver (paginated, filterable)
router.get('/visit-history', protect, getVisitHistory);

// Monthly visit trends + MoM change for the logged-in caregiver
router.get('/visit-trends', protect, getVisitTrends);

// Distinct elders the caregiver has visited
router.get('/elders-list', protect, getEldersList);

// General log list for a resident  (query: ?parent_id=X)
router.get('/', protect, getLogs);

// Submit a new health log  (supports optional file attachment via Cloudinary)
router.post('/', protect, uploadHealthAttachment.single('attachment'), addLog);

// Resident sidebar summary (profile + last log + condition history)
router.get('/resident/:id/summary', protect, getResidentSummary);

// Paginated log history for a resident  (query: ?page=1&limit=10)
router.get('/resident/:id/logs', protect, getResidentLogs);

// Health feed and analytics (must be before /:logId wildcard)
router.get('/feed', protect, getHealthFeed);
router.get('/analytics', protect, getAnalytics);

// Single log entry (wildcard — keep last among GET routes)
router.get('/:logId', protect, getLogById);

module.exports = router;
