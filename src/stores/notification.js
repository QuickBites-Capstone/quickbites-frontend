import { defineStore } from 'pinia';
import axios from 'axios';
import { getAuth } from '@/pages/auth/authServiceProvider/authService';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
  }),
  getters: {
    getUnreadNotificationCount(state) {
      return state.notifications.filter(notification => !notification.is_read).length;
    },
    getNotifications(state) {
      return state.notifications;
    },
  },
  actions: {
    async fetchNotifications(customerId, page) {
      const { token } = getAuth();
      try {
        const response = await axios.get(`/api/notifications?customer_id=${customerId}&page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.notifications = response.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    addNotification(notification) {
      this.notifications.unshift(notification);
    },
    async markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        try {
          const { token } = getAuth();
          await axios.put(`/api/notifications/${notificationId}`, {
            is_read: true,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          notification.is_read = true;
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      }
    },
    updateNotificationReadStatus(notificationId, isRead) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = isRead;
      }
    },
  },
});
