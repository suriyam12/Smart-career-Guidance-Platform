const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Sample questions
const sampleQuestions = [
  {
    id: 1,
    text: "What type of work environments do you prefer?",
    options: ["Fast-paced and dynamic", "Structured and organized", "Creative and flexible", "Collaborative team-based", "Independent and quiet"],
    category: "work_preference",
    allowMultiple: true
  },
  {
    id: 2,
    text: "Which activities interest you the most?",
    options: ["Problem-solving and analysis", "Creative design and art", "Helping and teaching others", "Leading and organizing", "Building and constructing"],
    category: "interests",
    allowMultiple: true
  },
  {
    id: 3,
    text: "What are your strongest skills?",
    options: ["Analytical thinking", "Creativity and innovation", "Communication", "Leadership", "Technical skills", "Organization"],
    category: "skills",
    allowMultiple: true
  },
  {
    id: 4,
    text: "What type of challenges do you enjoy?",
    options: ["Complex technical problems", "Creative design challenges", "Social and interpersonal issues", "Strategic planning", "Hands-on practical problems"],
    category: "challenges",
    allowMultiple: true
  },
  {
    id: 5,
    text: "How do you prefer to learn?",
    options: ["Reading and research", "Hands-on practice", "Visual demonstrations", "Group discussions", "Trial and error"],
    category: "learning_style",
    allowMultiple: true
  }
];

// Get quiz questions
router.get('/questions', (req, res) => {
  try {
    res.json({
      success: true,
      questions: sampleQuestions,
      totalQuestions: sampleQuestions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz questions'
    });
  }
});

// Save quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers, results, timeSpent, score } = req.body;
    
    console.log('Received quiz submission:', { 
      userId: req.user.id,
      answersCount: answers?.length,
      timeSpent,
      score 
    });

    // Create new quiz attempt
    const quizAttempt = new Quiz({
      userId: req.user.id,
      answers: answers || [],
      results: results || {},
      timeSpent: timeSpent || 0,
      score: score || 0
    });

    // Save quiz attempt
    await quizAttempt.save();

    // Update user's quiz history
    await User.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { quizHistory: quizAttempt._id },
        quizResults: results || {}
      }
    );

    res.json({
      success: true,
      message: 'Quiz results saved successfully',
      quizId: quizAttempt._id,
      results: results
    });

  } catch (error) {
    console.error('Error saving quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving quiz results',
      error: error.message
    });
  }
});

// Get user's quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .select('completedAt results score timeSpent quizVersion');

    res.json({
      success: true,
      history: quizzes,
      totalAttempts: quizzes.length
    });

  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz history',
      error: error.message
    });
  }
});

module.exports = router;