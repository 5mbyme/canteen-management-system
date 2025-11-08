const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Get my notifications
router.get('/', authenticate, notificationController.getMyNotifications);

// Get unread count
router.get('/unread/count', authenticate, notificationController.getUnreadCount);

// Mark as read
router.put('/:notificationId/read', authenticate, notificationController.markAsRead);

// Mark all as read
router.put('/read/all', authenticate, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', authenticate, notificationController.deleteNotification);

// Clear all notifications
router.delete('/', authenticate, notificationController.clearAllNotifications);

module.exports = router;