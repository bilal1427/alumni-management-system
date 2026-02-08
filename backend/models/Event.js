const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  eventTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Workshop', 'Seminar', 'Webinar', 'Networking', 'Alumni Meet', 'Other'],
    default: 'Other'
  },
  registrationLink: {
    type: String,
    default: ''
  },
  maxParticipants: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
