const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const authMiddleware = require('../middleware/auth');

// Get all notifications for logged-in user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.username);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Get unread notification count
router.get('/unread-count', authMiddleware, async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.username);
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.username);
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.put('/read-all', authMiddleware, async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id, req.user.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
