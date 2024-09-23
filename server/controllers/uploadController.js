const express = require('express');
const { uploadSingle, uploadMultiple } = require('../middleware/imageUpload'); // Import the single and multiple image upload middleware
const path = require('path');

// Single image upload
const uploadImage = (req, res) => {
  uploadSingle(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
   // Use path.join to ensure OS-specific paths and return normalized paths
   const filePath = path.win32.join('uploads', req.file.filename);
    
   res.status(200).json({ message: 'Image uploaded successfully', filePath });
 });
};

// Multiple images upload
const uploadImages = (req, res) => {
  uploadMultiple(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
   // Ensure paths are consistent using path.win32.join
   const filePaths = req.files.map(file => path.win32.join('uploads', file.filename));
    
   res.status(200).json({ message: 'Images uploaded successfully', filePaths });
 });
};



module.exports = {
  uploadImage,
  uploadImages
};
