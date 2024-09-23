const express = require('express');
const { updateUserProfile , getAdminProfile, getStatistics} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

//     Update user profile
router.put('/profile', authMiddleware, updateUserProfile);

//     Get admin profile

router.get('/profile', authMiddleware, getAdminProfile);

//     Get statistics
router.get('/statistics', authMiddleware, getStatistics);





module.exports = router;