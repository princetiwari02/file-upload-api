const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Local Storage ──────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// ── Cloudinary Storage ─────────────────────────────────────────
let cloudinaryStorage = null;
let cloudinary = null;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'uploads', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4'] },
  });
}

// ── File Filter ────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3|txt|csv/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('File type not allowed'));
};

// ── Export storages ────────────────────────────────────────────
const useCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME;

const upload = multer({
  storage: useCloudinary ? cloudinaryStorage : localStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

module.exports = { upload, cloudinary, useCloudinary };
