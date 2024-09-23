const Car = require('../models/Car');

// Add a new car
const addCar = async (req, res) => {
  try {
    const { marque, modele, description, prixLocation, disponibilites } = req.body;
    const images = req.files.map(file => file.path); // Store image paths

    const newCar = new Car({
      marque,
      modele,
      description,
      prixLocation,
      images,
      disponibilites
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update car details
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Update images if provided
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set car unavailability (indisponibilite)
const setCarIndisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateDebut, dateFin } = req.body;

    const car = await Car.findById(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Add new unavailability period to the indisponibilites array
    car.indisponibilites.push({ dateDebut, dateFin });
    await car.save();

    res.status(200).json({ message: 'Car unavailability updated', car });
  } catch (error) {
    console.error('Error updating car unavailability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ cars });
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get car by id
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ car });
  }
  catch (error) {
    console.error('Error getting car by id:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete a specific unavailability (indisponibilite) from a car
const deleteCarIndisponibility = async (req, res) => {
  try {
    const { id, indisponibilityId } = req.params; // Car ID and indisponibility index
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the index is valid
    if (indisponibilityId < 0 || indisponibilityId >= car.indisponibilites.length) {
      return res.status(400).json({ message: 'Invalid indisponibilité index' });
    }

    // Remove the indisponibility by index
    car.indisponibilites.splice(indisponibilityId, 1);
    await car.save();

    res.status(200).json({ message: 'Indisponibilité deleted successfully', car });
  } catch (error) {
    console.error('Error deleting indisponibilité:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 

module.exports = {
  addCar,
  updateCar,
  deleteCar,
  setCarIndisponibility,
  getAllCars,
  getCarById,
  deleteCarIndisponibility

};
