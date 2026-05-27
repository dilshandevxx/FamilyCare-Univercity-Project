const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getCaregiverSettings,
  updateCaregiverProfile,
  updateCaregiverAvailability,
  updateCaregiverNotifications,
  updateCaregiverPassword,
  uploadAvatar,
} = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/avatars')),
  filename: (req, file, cb) => cb(null, `user_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images are allowed'));
    cb(null, true);
  },
});

router.get('/profile',  protect, getProfile);
router.put('/profile',  protect, updateProfile);
router.post('/avatar',  protect, upload.single('avatar'), uploadAvatar);

// Caregiver settings
router.get('/caregiver-settings',                    protect, getCaregiverSettings);
router.put('/caregiver-settings/profile',            protect, updateCaregiverProfile);
router.put('/caregiver-settings/availability',       protect, updateCaregiverAvailability);
router.put('/caregiver-settings/notifications',      protect, updateCaregiverNotifications);
router.put('/caregiver-settings/password',           protect, updateCaregiverPassword);

module.exports = router;
