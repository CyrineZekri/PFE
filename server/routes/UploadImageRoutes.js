const express = require('express');
const router = express.Router();
const { uploadImage, uploadImages } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
// Image upload routes
router.post('/upload', authMiddleware, adminMiddleware, uploadImage); // For single image upload
router.post('/uploadMultiple', authMiddleware, adminMiddleware, uploadImages); // For multiple image upload

module.exports = router;
