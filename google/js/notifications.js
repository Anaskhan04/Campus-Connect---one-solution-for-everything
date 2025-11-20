import { api } from './api.js';
import { getStorageItem } from './storage.js';
import { STORAGE_KEYS } from './config.js';

// Notification bell icon and dropdown
let notificationBell = null;
let notificationDropdown = null;
let notificationBadge = null;
let unreadCount = 0;

// Initialize notifications on page load
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = getStorageItem(STORAGE_KEYS.LOGGED_IN_USER);
  if (!loggedInUser) return;

  initializeNotifications();
  loadNotifications();
  
  // Refresh notifications every 30 seconds
  setInterval(loadNotifications, 30000);
});

function initializeNotifications() {
  console.log('Initializing notifications...');
  // Find or create notification bell in top bar
  const topBarActions = document.querySelector('.top-bar-actions');
  console.log('topBarActions:', topBarActions);
  if (!topBarActions) {
    console.error('Could not find .top-bar-actions element in the DOM.');
    return;
  }

  // Check if notification bell already exists
  notificationBell = document.getElementById('notification-bell');
  
  if (!notificationBell) {
    // Create notification bell
    notificationBell = document.createElement('div');
    notificationBell.id = 'notification-bell';
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = `
      <i class="fas fa-bell"></i>
      <span id="notification-badge" class="notification-badge" style="display: none;">0</span>
    `;
    
    // Insert before profile avatar
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar) {
      topBarActions.insertBefore(notificationBell, profileAvatar);
    } else {
      topBarActions.appendChild(notificationBell);
    }
    
    notificationBadge = document.getElementById('notification-badge');
  } else {
    notificationBadge = document.getElementById('notification-badge');
  }

  // Check if notification dropdown already exists
  notificationDropdown = document.getElementById('notification-dropdown');
  if (!notificationDropdown) {
    // Create notification dropdown
    notificationDropdown = document.createElement('div');
    notificationDropdown.id = 'notification-dropdown';
    notificationDropdown.className = 'notification-dropdown';
    notificationDropdown.innerHTML = `
      <div class="notification-header">
        <h3>Notifications</h3>
        <button id="mark-all-read-btn" class="mark-all-read-btn">Mark all as read</button>
      </div>
      <div id="notification-list" class="notification-list">
        <div class="notification-loading">Loading notifications...</div>
      </div>
    `;
    document.body.appendChild(notificationDropdown);
  }

  // Toggle dropdown on bell click
  notificationBell.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
    if (notificationDropdown.classList.contains('active')) {
      loadNotifications();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!notificationBell.contains(e.target) && !notificationDropdown.contains(e.target)) {
      notificationDropdown.classList.remove('active');
    }
  });

  // Mark all as read button
  const markAllReadBtn = document.getElementById('mark-all-read-btn');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', async () => {
      try {
        await api.markAllNotificationsAsRead();
        await loadNotifications();
      } catch (error) {
        console.error('Error marking all as read:', error);
        alert('Error: ' + (error.message || 'Failed to mark all as read'));
      }
    });
  }
}

async function loadNotifications() {
  try {
    // Load unread count
    const countData = await api.getUnreadNotificationCount();
    unreadCount = countData.count || 0;
    updateNotificationBadge();

    // Load notifications if dropdown is open
    if (notificationDropdown && notificationDropdown.classList.contains('active')) {
      const notifications = await api.getNotifications();
      renderNotifications(notifications);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
    if (notificationBadge) {
      notificationBadge.style.display = 'none';
    }
  }
}

function updateNotificationBadge() {
  if (!notificationBadge) return;
  
  if (unreadCount > 0) {
    notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    notificationBadge.style.display = 'flex';
  } else {
    notificationBadge.style.display = 'none';
  }
}

function renderNotifications(notifications) {
  const notificationList = document.getElementById('notification-list');
  if (!notificationList) return;

  if (notifications.length === 0) {
    notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
    return;
  }

  notificationList.innerHTML = notifications.map(notification => {
    const timeAgo = getTimeAgo(notification.createdAt);
    const readClass = notification.read ? 'read' : 'unread';
    
    return `
      <div class="notification-item ${readClass}" data-id="${notification._id}">
        <div class="notification-content">
          <div class="notification-title">${escapeHtml(notification.title)}</div>
          <div class="notification-message">${escapeHtml(notification.message)}</div>
          <div class="notification-time">${timeAgo}</div>
        </div>
        <div class="notification-actions">
          ${!notification.read ? `<button class="mark-read-btn" data-id="${notification._id}" title="Mark as read">
            <i class="fas fa-check"></i>
          </button>` : ''}
          <button class="delete-notification-btn" data-id="${notification._id}" title="Delete">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners
  notificationList.querySelectorAll('.mark-read-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      try {
        await api.markNotificationAsRead(id);
        await loadNotifications();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    });
  });

  notificationList.querySelectorAll('.delete-notification-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this notification?')) {
        try {
          await api.deleteNotification(id);
          await loadNotifications();
        } catch (error) {
          console.error('Error deleting notification:', error);
          alert('Error: ' + (error.message || 'Failed to delete notification'));
        }
      }
    });
  });

  // Click on notification item to view complaint (if it's a complaint notification)
  notificationList.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.notification-actions')) return;
      
      const notification = notifications.find(n => n._id === item.getAttribute('data-id'));
      if (notification && notification.type === 'complaint' && notification.complaintId) {
        // Mark as read if unread
        if (!notification.read) {
          api.markNotificationAsRead(notification._id).then(() => loadNotifications());
        }
        // Navigate to complaints page
        window.location.href = '../pages/complaint.html';
      }
    });
  });
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export for use in other files
export { loadNotifications, updateNotificationBadge, initializeNotifications };


