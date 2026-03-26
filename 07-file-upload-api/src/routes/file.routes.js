const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const { uploadSingle, uploadMultiple, getMyFiles, deleteFile } = require('../controllers/file.controller');

router.use(auth);
router.post('/upload', upload.single('file'), uploadSingle);
router.post('/upload-multiple', upload.array('files', 10), uploadMultiple);
router.get('/', getMyFiles);
router.delete('/:id', deleteFile);

module.exports = router;
