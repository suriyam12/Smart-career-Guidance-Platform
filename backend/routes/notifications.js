const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user notifications
router.get('/:userId', async (req, res) => {
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

    const unreadCount = sortedNotifications.filter(notification => !notification.isRead).length;

    res.json({
      success: true,
      notifications: sortedNotifications,
      unreadCount: unreadCount,
      totalCount: sortedNotifications.length
    });

  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Mark notification as read
router.put('/:userId/read/:notificationId', async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = user.notifications.id(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await user.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification: notification
    });

  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
});

// Mark all notifications as read
router.put('/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mark all notifications as read
    if (user.notifications && user.notifications.length > 0) {
      user.notifications.forEach(notification => {
        notification.isRead = true;
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'All notifications marked as read',
      readCount: user.notifications ? user.notifications.length : 0
    });

  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read',
      error: error.message
    });
  }
});

// Delete notification
router.delete('/:userId/:notificationId', async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.notifications.pull(notificationId);
    await user.save();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

module.exports = router;