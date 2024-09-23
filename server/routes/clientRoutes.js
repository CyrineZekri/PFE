const express = require('express');
const { updateUserProfile, getClientProfile , getClientReservations } = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   PUT api/client/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

// @route   GET api/client/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getClientProfile);

// @route   GET api/client/reservations
// @desc    Get user reservations
// @access  Private
router.get('/reservations', authMiddleware, getClientReservations);


module.exports = router;