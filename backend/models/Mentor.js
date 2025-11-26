const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  sessions: {
    type: Number,
    default: 0
  },
  specialization: [{
    type: String
  }],
  bio: {
    type: String,
    default: ''
  },
  availability: {
    type: String,
    default: 'Available',
    enum: ['Available', 'Limited', 'Unavailable']
  },
  company: {
    type: String,
    default: ''
  },
  platform: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: String,
    default: ''
  },
  domain: {
    type: String,
    default: 'technology'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema);