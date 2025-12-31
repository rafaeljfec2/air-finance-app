import { notificationService } from '@/services/notificationService';
import { create } from 'zustand';

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'SYSTEM' | 'BUDGET' | 'BILL' | 'SECURITY';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO Date
  data?: any;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string, userId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notification: Notification) => void; 
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [data, count] = await Promise.all([
        notificationService.getAll(userId),
        notificationService.getUnreadCount(userId)
      ]);
      
      const mappedNotifications = data.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
        data: n.data
      }));

      set({ notifications: mappedNotifications, unreadCount: count });
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string, userId: string) => {
    // Optimistic update
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updatedNotifications,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    });

    try {
      await notificationService.markAsRead(id, userId);
    } catch (error) {
      // Revert if failed (optional, but good practice)
      console.error('Failed to mark as read', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    // Optimistic update
    set((state) => {
      const updatedNotifications = state.notifications.map((n) => ({ ...n, read: true }));
      return {
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    });

    try {
      await notificationService.markAllAsRead(userId);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  }
}));
