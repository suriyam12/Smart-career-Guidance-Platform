const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('name email profile createdAt');
    
    console.log('📥 Fetching profile for:', req.user.email);
    console.log('📊 Current profile:', user.profile);
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// Update user profile
router.put('/update', auth, async (req, res) => {
  try {
    const { skills, interests, education, experience, bio } = req.body;
    const userId = req.user._id;

    console.log('📝 Updating profile for user:', req.user.email);
    console.log('📊 Profile data received:', { skills, interests, education, experience, bio });

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.skills': skills || [],
          'profile.interests': interests || [],
          'profile.education': education || '',
          'profile.experience': experience || 0,
          'profile.bio': bio || ''
        }
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('name email profile createdAt updatedAt');

    console.log('✅ Profile updated successfully');
    console.log('📋 Updated skills:', updatedUser.profile.skills);
    console.log('🎯 Updated interests:', updatedUser.profile.interests);

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

module.exports = router;