const express = require('express');
const router = express.Router();
const { addCar, updateCar, deleteCar, setCarIndisponibility,getAllCars, getCarById ,deleteCarIndisponibility} = require('../controllers/carController');
const { uploadMultiple } = require('../middleware/imageUpload');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//get all cars 
router.get('/', getAllCars);
// get car by id 
router.get('/:id', getCarById);
// Add a new car
router.post('/', authMiddleware, adminMiddleware, uploadMultiple, addCar);

// Update car details
router.put('/:id', authMiddleware, adminMiddleware, uploadMultiple, updateCar);

// Delete a car
router.delete('/:id', authMiddleware, adminMiddleware, deleteCar);

// Set car availability
router.put('/availability/:id', authMiddleware, adminMiddleware, setCarIndisponibility);

// Delete a specific unavailability period
router.delete('/availability/:id/:indisponibilityId', authMiddleware, adminMiddleware, deleteCarIndisponibility);

module.exports = router;
