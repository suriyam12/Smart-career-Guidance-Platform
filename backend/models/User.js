const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['mentorship_accepted', 'mentorship_rejected', 'mentorship_completed', 'admin_message']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedRequestId: {
    type: mongoose.Schema.Types.ObjectId
  },
  mentorName: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const mentorshipRequestSchema = new mongoose.Schema({
  mentorId: {
    type: String,
    required: true
  },
  mentorName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected', 'completed']
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  },
  message: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  }
});

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  mentorRequests: [mentorshipRequestSchema],
  notifications: [notificationSchema],
  profile: {
    bio: String,
    skills: [String],
    interests: [String],
    education: String,
    experience: String
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);