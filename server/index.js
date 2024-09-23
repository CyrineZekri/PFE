const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Import routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const carRoutes = require('./routes/carRoutes');

// Use routes
app.use('/api', require('./routes/UploadImageRoutes'));
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
// Check if an admin exists, and create a default one if not
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      const admin = new User({
        nom: 'Admin',
        prenom: 'User',
        email: process.env.ADMIN_EMAIL,
        motDePasse: hashedPassword,
        telephone: '0000000000',
        adresse: 'Admin Address',
        role: 'Admin'
      });

      await admin.save();
      console.log('Default admin account created');
    } else {
      console.log('Admin account already exists');
    }
  } catch (err) {
    console.error('Error creating default admin:', err.message);
  }
};

// Call the function to create default admin
createDefaultAdmin();

// Set the port dynamically
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("Express on Vercel"));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
