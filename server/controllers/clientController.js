const User = require('../models/User');
const Reservation = require('../models/ReservationSchema'); // Import the Reservation model

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { nom,email, prenom, telephone, adresse } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.telephone = telephone || user.telephone;
    user.adresse = adresse || user.adresse;
    user.email = email || user.email;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
//get client profile
const getClientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the returned data

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
//get client reservations
const getClientReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.user.id })
    .populate('car'); 
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


module.exports = { updateUserProfile, getClientProfile, getClientReservations };