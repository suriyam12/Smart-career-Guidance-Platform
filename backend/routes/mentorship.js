const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Handle mentorship request from frontend
router.post('/request', async (req, res) => {
  try {
    const { mentorId, mentorName, message, userId } = req.body;

    console.log('🎯 Received mentorship request:', {
      mentorId,
      mentorName,
      message,
      userId
    });

    // Find user by ID or use the first user as fallback
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      // Fallback: get the first user (for testing)
      user = await User.findOne({});
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    console.log(`👤 User found: ${user.name} (${user.email})`);

    // Create new mentorship request
    const newRequest = {
      mentorId: mentorId,
      mentorName: mentorName,
      status: 'pending',
      requestedAt: new Date(),
      message: message || `Mentorship request for ${mentorName}`,
      userEmail: user.email,
      userName: user.name
    };

    // Add to user's mentorRequests array
    user.mentorRequests.push(newRequest);
    await user.save();

    // Get the saved request with ID
    const savedRequest = user.mentorRequests[user.mentorRequests.length - 1];

    console.log('✅ Mentorship request saved successfully!', {
      requestId: savedRequest._id,
      userName: user.name,
      mentorName: mentorName,
      totalRequests: user.mentorRequests.length
    });

    res.json({
      success: true,
      message: 'Mentorship request sent successfully! The admin will review your request soon.',
      request: savedRequest,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Error creating mentorship request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send mentorship request. Please try again.',
      error: error.message
    });
  }
});

// Get user's mentorship requests
router.get('/my-requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('mentorRequests name email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Sort requests by date (newest first)
    const sortedRequests = user.mentorRequests
      ? user.mentorRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
      : [];

    res.json({
      success: true,
      requests: sortedRequests,
      user: {
        name: user.name,
        email: user.email
      },
      total: sortedRequests.length
    });

  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentorship requests',
      error: error.message
    });
  }
});

module.exports = router;