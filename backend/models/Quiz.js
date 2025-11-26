const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    answer: {
      type: [String],
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }],
  results: {
    personalityType: String,
    careerRecommendations: [{
      field: String,
      role: String,
      matchPercentage: Number,
      description: String,
      skillsRequired: [String],
      growthProspects: String
    }],
    strengths: [String],
    areasForDevelopment: [String],
    suggestedSkills: [String],
    compatibilityScore: Number
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  quizVersion: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);