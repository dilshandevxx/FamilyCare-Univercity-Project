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
  getEldersList

} = require('../controllers/healthController');

// ── File upload for health-log attachments ────────────────────────
const uploadDir = path.join(__dirname, '../../uploads/health-attachments');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `log_${req.user?.id}_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.mimetype))
      return cb(new Error('Only JPEG, PNG, WEBP images and PDF files are allowed'));
    cb(null, true);
  },
});

// ── Routes ────────────────────────────────────────────────────────

// Visit history for the logged-in caregiver (paginated, filterable)
router.get('/visit-history', protect, getVisitHistory);

// Monthly visit trends + MoM change for the logged-in caregiver
router.get('/visit-trends', protect, getVisitTrends);

// Distinct elders the caregiver has visited
router.get('/elders-list', protect, getEldersList);

// General log list for a resident  (query: ?parent_id=X)
router.get('/', protect, getLogs);

// Submit a new health log  (supports optional file attachment)
router.post('/', protect, upload.single('attachment'), addLog);

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
