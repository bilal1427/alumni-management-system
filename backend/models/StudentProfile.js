const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enrollmentYear: {
    type: Number,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
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

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
