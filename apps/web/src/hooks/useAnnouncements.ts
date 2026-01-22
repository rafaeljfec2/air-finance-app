import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsService, type Announcement } from '@/services/announcementsService';
import { useAuth } from './useAuth';

export function useAnnouncements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: unreadAnnouncements = [],
    isLoading,
    error,
  } = useQuery<Announcement[]>({
    queryKey: ['announcements', 'unread', user?.id],
    queryFn: () => announcementsService.getUnreadAnnouncements(),
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (announcementId: string) => announcementsService.markAsRead(announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'read'] });
    },
  });

  const markAsRead = async (announcementId: string) => {
    return markAsReadMutation.mutateAsync(announcementId);
  };

  return {
    unreadAnnouncements,
    isLoading,
    error,
    markAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}
