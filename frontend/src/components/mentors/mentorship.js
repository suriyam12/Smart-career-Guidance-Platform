const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Handle mentorship request from frontend
router.post('/request', async (req, res) => {
  try {
    const { mentorId, mentorName, message } = req.body;

    console.log('🎯 Received mentorship request from frontend:', {
      mentorId,
      mentorName,
      message
    });

    // Get the first user (for testing - in real app, use authenticated user)
    const user = await User.findOne({});
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);

    // Initialize mentorRequests array if it doesn't exist
    if (!user.mentorRequests) {
      user.mentorRequests = [];
      console.log('📝 Initialized empty mentorRequests array');
    }

    // Create new mentorship request
    const newRequest = {
      mentorId: mentorId || 'unknown_id',
      mentorName: mentorName || 'Unknown Mentor',
      status: 'pending',
      requestedAt: new Date(),
      message: message || `Mentorship request for ${mentorName}`,
      userEmail: user.email,
      userName: user.name
    };

    console.log('📋 Creating new request:', newRequest);

    // Add to user's mentorRequests array
    user.mentorRequests.push(newRequest);
    await user.save();

    // Get the saved request with its ID
    const savedRequest = user.mentorRequests[user.mentorRequests.length - 1];

    console.log('✅ Mentorship request saved successfully!', {
      requestId: savedRequest._id,
      userName: user.name,
      totalRequests: user.mentorRequests.length
    });

    res.json({
      success: true,
      message: 'Mentorship request sent successfully!',
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
      message: 'Error creating mentorship request',
      error: error.message
    });
  }
});

// Get all mentorship requests (alternative endpoint)
router.get('/requests', async (req, res) => {
  try {
    const users = await User.find({ 'mentorRequests.0': { $exists: true } });
    
    let allRequests = [];
    users.forEach(user => {
      if (user.mentorRequests && user.mentorRequests.length > 0) {
        user.mentorRequests.forEach(request => {
          allRequests.push({
            ...request.toObject(),
            userId: user._id,
            userName: user.name,
            userEmail: user.email
          });
        });
      }
    });

    res.json({
      success: true,
      requests: allRequests,
      total: allRequests.length
    });

  } catch (error) {
    console.error('❌ Error fetching mentorship requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentorship requests',
      error: error.message
    });
  }
});

module.exports = router;