const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const indisponibiliteSchema = new Schema({
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  }
}, { _id: true }); // Enables automatic _id for each indisponibilite

const carSchema = new Schema({
  marque: {
    type: String,
    required: true,
    trim: true
  },
  modele: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  prixLocation: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String, // URL of the images
    required: true
  }],
  indisponibilites: [indisponibiliteSchema],  // Car is unavailable during these periods
  dateAjout: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', carSchema);
