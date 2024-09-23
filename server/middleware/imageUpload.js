const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init single image upload
const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('image'); // Handle single image upload

// Init multiple images upload
const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit per file
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).array('images', 10); // Handle up to 10 images

module.exports = {
  uploadSingle,
  uploadMultiple
};
