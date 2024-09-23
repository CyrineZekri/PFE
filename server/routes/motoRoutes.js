const express = require('express');
const router = express.Router();
const { addmoto, updatemoto, deletemoto, setmotoIndisponibility,getAllmotos, getmotoById ,deletemotoIndisponibility} = require('../controllers/motoController');
const { uploadMultiple } = require('../middleware/imageUpload');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//get all cars 
router.get('/', getAllmotos);
// get car by id 
router.get('/:id', getmotoById);
// Add a new car
router.post('/', authMiddleware, adminMiddleware, addmoto);

// Update car details
router.put('/:id', authMiddleware, adminMiddleware, uploadMultiple, updatemoto);

// Delete a car
router.delete('/:id', authMiddleware, adminMiddleware, deletemoto);

// Set car availability
router.put('/availability/:id', authMiddleware, adminMiddleware, setmotoIndisponibility);

// Delete a specific unavailability period
router.delete('/availability/:id/:indisponibilityId', authMiddleware, adminMiddleware, deletemotoIndisponibility);

module.exports = router;
