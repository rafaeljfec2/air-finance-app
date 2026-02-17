import { apiClient } from './apiClient';

export interface Notification {
  readonly id: string;
  readonly userId: string;
  readonly type:
    | 'INFO'
    | 'WARNING'
    | 'SUCCESS'
    | 'ERROR'
    | 'SYSTEM'
    | 'BUDGET'
    | 'BILL'
    | 'SECURITY';
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly data?: Record<string, unknown>;
  readonly createdAt: string;
}

export const notificationService = {
  getAll: async (userId: string): Promise<Notification[]> => {
    try {
      const response = await apiClient.get<Notification[]>(`/notifications?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error; // Let the store handle the error or silence it
    }
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const response = await apiClient.get<number>(`/notifications/unread-count?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  markAsRead: async (id: string, userId: string): Promise<Notification> => {
    try {
      const response = await apiClient.patch<Notification>(`/notifications/${id}/read`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await apiClient.patch('/notifications/read-all', { userId });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
};
