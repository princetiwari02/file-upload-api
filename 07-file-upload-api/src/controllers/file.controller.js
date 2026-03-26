const path = require('path');
const fs = require('fs');
const File = require('../models/file.model');
const { cloudinary, useCloudinary } = require('../middleware/upload.middleware');

// POST /api/files/upload (single)
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileData = {
      user: req.user.id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder: req.body.folder || 'general',
    };

    if (useCloudinary) {
      fileData.storageType = 'cloudinary';
      fileData.url = req.file.path;
      fileData.publicId = req.file.filename;
      fileData.fileName = req.file.filename;
    } else {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      fileData.storageType = 'local';
      fileData.fileName = req.file.filename;
      fileData.url = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const file = await File.create(fileData);
    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/files/upload-multiple
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No files uploaded' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const savedFiles = await Promise.all(req.files.map(f => {
      const data = {
        user: req.user.id,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        folder: req.body.folder || 'general',
      };
      if (useCloudinary) {
        data.storageType = 'cloudinary'; data.url = f.path;
        data.publicId = f.filename; data.fileName = f.filename;
      } else {
        data.storageType = 'local'; data.fileName = f.filename;
        data.url = `${baseUrl}/uploads/${f.filename}`;
      }
      return File.create(data);
    }));

    res.status(201).json({ message: `${savedFiles.length} files uploaded`, files: savedFiles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/files
exports.getMyFiles = async (req, res) => {
  try {
    const { folder, mimeType, page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };
    if (folder) query.folder = folder;
    if (mimeType) query.mimeType = { $regex: mimeType };

    const files = await File.find(query).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await File.countDocuments(query);
    res.json({ total, files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/files/:id
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    if (file.storageType === 'cloudinary' && cloudinary) {
      await cloudinary.uploader.destroy(file.publicId);
    } else {
      const filePath = path.join(__dirname, '../../uploads', file.fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
