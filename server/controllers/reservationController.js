const Reservation = require('../models/ReservationSchema');
const Car = require('../models/Car');
 
// Add a new reservation
// Add a new reservation
const addReservation = async (req, res) => {
    const { carId, dateDebut, dateFin } = req.body;
    const clientId = req.user.id; // Assuming req.user contains the logged-in user's data

    try {
        // Convert date strings to Date objects
        const requestedStartDate = new Date(dateDebut);
        const requestedEndDate = new Date(dateFin);

        // Check if the dates are valid
        if (isNaN(requestedStartDate) || isNaN(requestedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format. Please provide valid dates.' });
        }

        // Check if the car exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Check if any unavailable period overlaps with the requested dates
        const isUnavailable = car.indisponibilites.some(dispo => {
            const unavailableStartDate = new Date(dispo.dateDebut);
            const unavailableEndDate = new Date(dispo.dateFin);

            // Check if the requested dates overlap with the unavailable dates
            return (
                (requestedStartDate <= unavailableEndDate && requestedEndDate >= unavailableStartDate)
            );
        });

        // If any overlap is found, the car is not available for the selected dates
        if (isUnavailable) {
            return res.status(400).json({ message: 'Car is not available for the selected dates' });
        }

        // Create and save the new reservation
        const reservation = new Reservation({
            car: carId,
            client: clientId,
            dateDebut: requestedStartDate,
            dateFin: requestedEndDate
        });

        await reservation.save();
        res.status(201).json({ message: 'Reservation added successfully', reservation });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


// Accept a reservation request
const acceptReservation = async (req, res) => {
    try {
      const { reservationId } = req.params;
      const reservation = await Reservation.findById(reservationId).populate('car');
  
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      const car = reservation.car;
  
      // Check if the car is already reserved for the requested period
      const isCarUnavailable = car.indisponibilites.some((unavailability) => {
        const requestedStart = new Date(reservation.dateDebut);
        const requestedEnd = new Date(reservation.dateFin);
        const existingStart = new Date(unavailability.dateDebut);
        const existingEnd = new Date(unavailability.dateFin);
  
        // Check for overlapping dates
        return (
          (requestedStart <= existingEnd && requestedStart >= existingStart) || // Start date is within an existing period
          (requestedEnd <= existingEnd && requestedEnd >= existingStart) ||     // End date is within an existing period
          (requestedStart <= existingStart && requestedEnd >= existingEnd)      // New period encompasses an existing period
        );
      });
  
      if (isCarUnavailable) {
        return res.status(400).json({ message: 'Car is already reserved for the requested period' });
      }
  
      // Check the database for overlapping accepted reservations for the same car
      const existingReservations = await Reservation.find({
        car: car._id,
        status: 'Accepted',
        $or: [
          { dateDebut: { $lte: reservation.dateFin, $gte: reservation.dateDebut } },
          { dateFin: { $lte: reservation.dateFin, $gte: reservation.dateDebut } },
          { dateDebut: { $lte: reservation.dateDebut }, dateFin: { $gte: reservation.dateFin } }
        ]
      });
  
      if (existingReservations.length > 0) {
        return res.status(400).json({ message: 'Car is already reserved for the requested period' });
      }
  
      // Mark the reservation as accepted
      reservation.status = 'Accepted';
      await reservation.save();
  
      // Update the car's unavailability with unique periods
      const newIndisponibility = {
        dateDebut: reservation.dateDebut,
        dateFin: reservation.dateFin
      };
  
      // Ensure no duplicate periods in the car's unavailability array
      const isPeriodAlreadyAdded = car.indisponibilites.some((unavailability) => {
        return (
          unavailability.dateDebut.getTime() === newIndisponibility.dateDebut.getTime() &&
          unavailability.dateFin.getTime() === newIndisponibility.dateFin.getTime()
        );
      });
  
      if (!isPeriodAlreadyAdded) {
        car.indisponibilites.push(newIndisponibility);
        await car.save();
      }
  
      res.status(200).json({ message: 'Reservation accepted and car unavailability updated', reservation });
    } catch (error) {
      console.error('Error accepting reservation:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

// Refuse a reservation
const refuseReservation = async (req, res) => {
    const { reservationId } = req.params;

    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Update reservation status to 'Refused'
        reservation.status = 'Refused';
        await reservation.save();

        res.json({ message: 'Reservation refused', reservation });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Get all reservations
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
        .populate('client', 'nom prenom email telephone adresse') // Populating client details
        .populate('car', 'marque modele images prixLocation'); // Populating car details

        res.json(reservations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Get reservation details by ID
const getReservationById = async (req, res) => {
    const { reservationId } = req.params;

    try {
        const reservation = await Reservation.findById(reservationId)
            .populate('client', 'nom prenom email telephone adresse') // Populating client details
            .populate('car', 'marque modele images prixLocation'); // Populating car details

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = { addReservation, acceptReservation, refuseReservation  , getAllReservations, getReservationById };
