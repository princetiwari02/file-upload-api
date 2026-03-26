const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true }, // bytes
  storageType: { type: String, enum: ['local', 'cloudinary'], default: 'local' },
  url: { type: String, required: true },
  publicId: { type: String, default: null }, // Cloudinary public_id
  folder: { type: String, default: 'general' },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
