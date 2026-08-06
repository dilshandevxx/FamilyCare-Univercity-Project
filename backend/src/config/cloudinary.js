const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary from environment
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
   process.env.CLOUDINARY_API_KEY &&
   process.env.CLOUDINARY_API_SECRET)
);

// ── Health Log Attachment Upload Middleware ──────────────────
let healthStorage;
if (isCloudinaryConfigured) {
  healthStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'familycare/health-attachments',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      resource_type: 'auto',
      public_id: (req, file) => {
        const cleanName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
        return `log_${req.user?.id || 'anon'}_${Date.now()}_${cleanName}`;
      },
    },
  });
} else {
  // Local disk fallback
  const localHealthDir = path.join(__dirname, '../../uploads/health-attachments');
  if (!fs.existsSync(localHealthDir)) fs.mkdirSync(localHealthDir, { recursive: true });
  healthStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, localHealthDir),
    filename: (req, file, cb) =>
      cb(null, `log_${req.user?.id || 'anon'}_${Date.now()}${path.extname(file.originalname)}`),
  });
}

const uploadHealthAttachment = multer({
  storage: healthStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP images and PDF files are allowed'));
    }
    cb(null, true);
  },
});

// ── User / Profile Avatar Upload Middleware ──────────────────
let avatarStorage;
if (isCloudinaryConfigured) {
  avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'familycare/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      resource_type: 'image',
      public_id: (req, file) => `user_${req.user?.id || 'anon'}_${Date.now()}`,
    },
  });
} else {
  // Local disk fallback
  const localAvatarDir = path.join(__dirname, '../../uploads/avatars');
  if (!fs.existsSync(localAvatarDir)) fs.mkdirSync(localAvatarDir, { recursive: true });
  avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, localAvatarDir),
    filename: (req, file, cb) =>
      cb(null, `user_${req.user?.id || 'anon'}_${Date.now()}${path.extname(file.originalname)}`),
  });
}

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for avatars'));
    }
    cb(null, true);
  },
});

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadHealthAttachment,
  uploadAvatar,
};
