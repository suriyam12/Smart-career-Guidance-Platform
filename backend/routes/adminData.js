const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users for admin
router.get('/users', async (req, res) => {
  try {
    console.log('📊 Admin: Fetching all users...');
    
    const users = await User.find({})
      .select('name email role profile createdAt lastLogin mentorRequests notifications isActive')
      .sort({ createdAt: -1 });

    console.log(`✅ Admin: Found ${users.length} users`);

    res.json({
      success: true,
      users: users,
      total: users.length
    });

  } catch (error) {
    console.error('❌ Admin: Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get all mentorship requests for admin
router.get('/mentorship-requests', async (req, res) => {
  try {
    console.log('📨 Admin: Fetching all mentorship requests...');
    
    // Get all users with their mentorship requests
    const users = await User.find({ 
      'mentorRequests.0': { $exists: true } 
    }).select('name email mentorRequests');

    let allRequests = [];
    let usersWithRequests = 0;

    users.forEach(user => {
      if (user.mentorRequests && user.mentorRequests.length > 0) {
        usersWithRequests++;
        
        user.mentorRequests.forEach(request => {
          allRequests.push({
            _id: request._id,
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            mentorId: request.mentorId,
            mentorName: request.mentorName,
            status: request.status,
            requestedAt: request.requestedAt,
            respondedAt: request.respondedAt,
            message: request.message,
            adminNotes: request.adminNotes
          });
        });
      }
    });

    // Sort by requested date (newest first)
    allRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

    console.log(`✅ Admin: Found ${allRequests.length} requests from ${usersWithRequests} users`);

    const pendingCount = allRequests.filter(req => req.status === 'pending').length;

    res.json({
      success: true,
      requests: allRequests,
      total: allRequests.length,
      pending: pendingCount,
      stats: {
        totalUsers: users.length,
        usersWithRequests: usersWithRequests,
        totalRequests: allRequests.length,
        pendingRequests: pendingCount
      }
    });

  } catch (error) {
    console.error('❌ Admin: Error fetching mentorship requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentorship requests',
      error: error.message
    });
  }
});

// Update mentorship request status - WITH NOTIFICATIONS
router.put('/mentorship-requests/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body;

    console.log('🔄 Admin: Updating mentorship request:', { requestId, status });

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
        message: 'Mentorship request not found in user'
      });
    }

    const oldStatus = request.status;
    request.status = status;
    request.respondedAt = new Date();
    if (adminNotes) request.adminNotes = adminNotes;

    // Create notification based on status change
    let notification = null;
    
    if (status === 'accepted') {
      notification = {
        type: 'mentorship_accepted',
        title: '🎉 Mentorship Request Accepted!',
        message: `Your mentorship request with ${request.mentorName} has been accepted! You can now start your mentorship sessions.`,
        relatedRequestId: requestId,
        mentorName: request.mentorName,
        isRead: false
      };
    } else if (status === 'rejected') {
      notification = {
        type: 'mentorship_rejected',
        title: '❌ Mentorship Request Declined',
        message: `Your mentorship request with ${request.mentorName} has been declined. ${adminNotes ? `Reason: ${adminNotes}` : 'Please try another mentor.'}`,
        relatedRequestId: requestId,
        mentorName: request.mentorName,
        isRead: false
      };
    } else if (status === 'completed') {
      notification = {
        type: 'mentorship_completed',
        title: '✅ Mentorship Completed',
        message: `Your mentorship session with ${request.mentorName} has been marked as completed. Thank you for using our platform!`,
        relatedRequestId: requestId,
        mentorName: request.mentorName,
        isRead: false
      };
    }

    // Add notification to user
    if (notification) {
      if (!user.notifications) {
        user.notifications = [];
      }
      user.notifications.push(notification);
      console.log(`📢 Created ${status} notification for user: ${user.name}`);
    }

    await user.save();

    console.log('✅ Admin: Mentorship request updated successfully:', {
      userName: user.name,
      mentorName: request.mentorName,
      oldStatus: oldStatus,
      newStatus: status,
      notificationCreated: !!notification
    });

    res.json({
      success: true,
      message: `Mentorship request ${status} successfully`,
      request: {
        _id: request._id,
        mentorName: request.mentorName,
        status: request.status,
        requestedAt: request.requestedAt,
        respondedAt: request.respondedAt,
        adminNotes: request.adminNotes
      },
      user: {
        name: user.name,
        email: user.email
      },
      notification: notification
    });

  } catch (error) {
    console.error('❌ Admin: Error updating mentorship request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating mentorship request',
      error: error.message
    });
  }
});

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📈 Admin: Fetching dashboard statistics...');
    
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // Count mentorship requests
    const usersWithRequests = await User.find({ 
      'mentorRequests.0': { $exists: true } 
    });
    
    let totalRequests = 0;
    let pendingRequests = 0;
    let acceptedRequests = 0;
    let rejectedRequests = 0;
    let completedRequests = 0;

    usersWithRequests.forEach(user => {
      totalRequests += user.mentorRequests.length;
      user.mentorRequests.forEach(request => {
        switch (request.status) {
          case 'pending':
            pendingRequests++;
            break;
          case 'accepted':
            acceptedRequests++;
            break;
          case 'rejected':
            rejectedRequests++;
            break;
          case 'completed':
            completedRequests++;
            break;
        }
      });
    });

    // Get recent users (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: oneWeekAgo },
      role: 'user'
    });

    const stats = {
      totalUsers,
      totalAdmins,
      totalMentors: 18, // Hardcoded for now
      totalRequests,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
      completedRequests,
      recentUsers
    };

    console.log('✅ Admin: Dashboard stats calculated:', stats);

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('❌ Admin: Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// Create test user and request (for development)
router.post('/create-test-data', async (req, res) => {
  try {
    console.log('🧪 Creating test data...');

    // Create or find test user
    let user = await User.findOne({ email: 'testuser@example.com' });
    
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'test123',
        role: 'user'
      });
      await user.save();
      console.log('✅ Test user created');
    }

    // Add test mentorship request
    const testRequest = {
      mentorId: '1',
      mentorName: 'Sarah Chen',
      status: 'pending',
      requestedAt: new Date(),
      message: 'This is a test mentorship request from the test user.'
    };

    user.mentorRequests.push(testRequest);
    await user.save();

    const savedRequest = user.mentorRequests[user.mentorRequests.length - 1];

    console.log('✅ Test data created successfully');

    res.json({
      success: true,
      message: 'Test data created successfully',
      user: {
        name: user.name,
        email: user.email,
        _id: user._id
      },
      request: savedRequest
    });

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test data',
      error: error.message
    });
  }
});

// Get user details with requests
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('name email role mentorRequests createdAt lastLogin');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Get user notifications (for admin view)
router.get('/user/:userId/notifications', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('notifications name email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Sort notifications by creation date (newest first)
    const sortedNotifications = user.notifications
      ? user.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];

    res.json({
      success: true,
      notifications: sortedNotifications,
      totalCount: sortedNotifications.length,
      unreadCount: sortedNotifications.filter(notification => !notification.isRead).length
    });

  } catch (error) {
    console.error('❌ Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user notifications',
      error: error.message
    });
  }
});

module.exports = router;