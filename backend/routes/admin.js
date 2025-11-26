const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const auth = require('../middleware/auth');

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Get all mentorship requests (Admin only)
router.get('/mentorship-requests', auth, adminAuth, async (req, res) => {
  try {
    // Get all users with their mentorship requests
    const users = await User.find({ 
      'mentorRequests.0': { $exists: true } 
    }).select('name email mentorRequests');

    let allRequests = [];
    
    users.forEach(user => {
      user.mentorRequests.forEach(request => {
        allRequests.push({
          _id: request._id,
          userName: user.name,
          userEmail: user.email,
          mentorName: request.mentorName,
          status: request.status,
          requestedAt: request.requestedAt,
          respondedAt: request.respondedAt,
          adminNotes: request.adminNotes,
          userContact: request.userContact,
          mentorContact: request.mentorContact
        });
      });
    });

    // Sort by requested date (newest first)
    allRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

    res.json({
      success: true,
      requests: allRequests,
      total: allRequests.length,
      pending: allRequests.filter(req => req.status === 'pending').length
    });

  } catch (error) {
    console.error('Error fetching mentorship requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentorship requests',
      error: error.message
    });
  }
});

// Update mentorship request status (Admin only)
router.put('/mentorship-requests/:requestId', auth, adminAuth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes, mentorContact, userContact } = req.body;

    console.log('🔄 Updating mentorship request:', { requestId, status });

    // Find user with this mentorship request
    const user = await User.findOne({ 
      'mentorRequests._id': requestId 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Find the specific request
    const request = user.mentorRequests.id(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Update request
    request.status = status;
    request.respondedAt = new Date();
    if (adminNotes) request.adminNotes = adminNotes;
    if (mentorContact) request.mentorContact = mentorContact;
    if (userContact) request.userContact = userContact;

    await user.save();

    console.log('✅ Mentorship request updated successfully');

    res.json({
      success: true,
      message: `Mentorship request ${status} successfully`,
      request: request
    });

  } catch (error) {
    console.error('Error updating mentorship request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating mentorship request',
      error: error.message
    });
  }
});

// Get admin dashboard stats
router.get('/dashboard-stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMentors = await Mentor.countDocuments({ isActive: true });
    
    const usersWithRequests = await User.find({ 
      'mentorRequests.0': { $exists: true } 
    });
    
    let totalRequests = 0;
    let pendingRequests = 0;
    
    usersWithRequests.forEach(user => {
      totalRequests += user.mentorRequests.length;
      pendingRequests += user.mentorRequests.filter(req => req.status === 'pending').length;
    });

    const acceptedRequests = totalRequests - pendingRequests;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMentors,
        totalRequests,
        pendingRequests,
        acceptedRequests
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// Get all users (Admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('name email profile createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users,
      total: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

module.exports = router;