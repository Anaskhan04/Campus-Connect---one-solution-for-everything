const Notification = require('../models/Notification');

class NotificationService {
  async getNotifications(username) {
    return await Notification.find({
      recipient: username,
    })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async getUnreadCount(username) {
    return await Notification.countDocuments({
      recipient: username,
      read: false,
    });
  }

  async markAsRead(id, username) {
    const notification = await Notification.findById(id);

    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    if (notification.recipient !== username) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    notification.read = true;
    await notification.save();
    return notification;
  }

  async markAllAsRead(username) {
    await Notification.updateMany({ recipient: username, read: false }, { read: true });
    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(id, username) {
    const notification = await Notification.findById(id);

    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    if (notification.recipient !== username) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    await Notification.findByIdAndDelete(id);
    return { message: 'Notification deleted' };
  }
}

module.exports = new NotificationService();
