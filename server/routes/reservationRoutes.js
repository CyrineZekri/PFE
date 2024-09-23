const express = require('express');
const router = express.Router();
const { addReservation, acceptReservation, refuseReservation, getAllReservations , getReservationById } = require('../controllers/reservationController'); 
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   POST /api/reservations
// @desc    Add a new reservation (Client only)
// @access  Private
router.post('/', authMiddleware, addReservation);

// @route   PUT /api/reservations/accept/:reservationId
// @desc    Accept a reservation (Admin only)
// @access  Private
router.put('/accept/:reservationId', authMiddleware, adminMiddleware, acceptReservation);

// @route   PUT /api/reservations/refuse/:reservationId
// @desc    Refuse a reservation (Admin only)
// @access  Private
router.put('/refuse/:reservationId', authMiddleware, adminMiddleware, refuseReservation);

// @route   GET /api/reservations
// @desc    Get all reservations (Admin only)
// @access  Private
router.get('/', authMiddleware, adminMiddleware, getAllReservations);

// @route   GET /api/reservations/:reservationId
// @desc    Get a reservation by ID (Admin only)
// @access  Private
router.get('/:reservationId', authMiddleware, adminMiddleware, getReservationById);


module.exports = router;