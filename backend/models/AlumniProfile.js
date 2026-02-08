const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  currentCompany: {
    type: String,
    default: ''
  },
  currentPosition: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  linkedIn: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  achievements: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);
