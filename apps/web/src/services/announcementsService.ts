import { apiClient } from './apiClient';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'welcome' | 'important' | 'update';
  priority: 'normal' | 'important' | 'urgent';
  imageUrl?: string;
  actionButtonText?: string;
  actionButtonLink?: string;
  targetAudience?: 'all' | 'beta' | 'new_users';
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

export const announcementsService = {
  getUnreadAnnouncements: async (): Promise<Announcement[]> => {
    const response = await apiClient.get('/announcements/unread');
    return response.data;
  },

  markAsRead: async (announcementId: string): Promise<void> => {
    await apiClient.post(`/announcements/${announcementId}/read`);
  },

  getReadHistory: async (): Promise<Announcement[]> => {
    const response = await apiClient.get('/announcements/read');
    return response.data;
  },
};
