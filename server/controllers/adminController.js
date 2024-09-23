const User = require('../models/User');
const Car = require('../models/Car');

// Update User Profile

const updateUserProfile = async (req, res) => {
    const { nom, prenom, telephone, adresse } = req.body;
    
    try {
        const user = await User.findById(req.user.id);
    
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
    
        user.nom = nom || user.nom;
        user.prenom = prenom || user.prenom;
        user.telephone = telephone || user.telephone;
        user.adresse = adresse || user.adresse;
    
        await user.save();
    
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    };

    //get admin profile
    const getAdminProfile = async (req, res) => {
        try {
          const user = await User.findById(req.user.id).select('-motDePasse');
            res.json(user);
        }
        catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
        }

        //statistique

const getStatistics = async (req, res) => {
  try {
      // Count the total number of cars
      const totalCars = await Car.countDocuments();

      // Count the total number of clients
      const totalClients = await User.countDocuments({ role: 'Client' });

      // Count the number of cars available today
      const today = new Date();
      const availableCarsToday = await Car.countDocuments({
          indisponibilites: {
              $not: {
                  $elemMatch: {
                      dateDebut: { $lte: today },
                      dateFin: { $gte: today }
                  }
              }
          }
      });

      res.json({
          totalCars,
          totalClients,
          availableCarsToday
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

module.exports = { updateUserProfile  , getAdminProfile , getStatistics};