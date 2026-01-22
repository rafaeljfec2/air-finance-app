import { useQuery } from '@tanstack/react-query';
import { announcementsService, type Announcement } from '@/services/announcementsService';
import { formatDate } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Sparkles, AlertCircle, Megaphone } from 'lucide-react';

export function AnnouncementsList() {
  const { data: readAnnouncements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ['announcements', 'read'],
    queryFn: () => announcementsService.getReadHistory(),
  });

  const getTypeIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'welcome':
        return Sparkles;
      case 'feature':
        return CheckCircle2;
      case 'important':
        return AlertCircle;
      case 'update':
        return Megaphone;
      default:
        return Sparkles;
    }
  };

  const getTypeLabel = (type: Announcement['type']) => {
    switch (type) {
      case 'welcome':
        return 'Bem-vindo';
      case 'feature':
        return 'Nova Feature';
      case 'important':
        return 'Importante';
      case 'update':
        return 'Atualização';
      default:
        return 'Aviso';
    }
  };

  const getPriorityBadgeColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800';
      case 'important':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-800';
      case 'normal':
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (readAnnouncements.length === 0) {
    return (
      <Card className="p-8 text-center bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <p className="text-gray-500 dark:text-gray-400">
          Você ainda não leu nenhum aviso.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {readAnnouncements.map((announcement) => {
        const TypeIcon = getTypeIcon(announcement.type);
        return (
          <Card
            key={announcement.id}
            className="p-6 bg-card dark:bg-card-dark border-border dark:border-border-dark"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <TypeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                    {announcement.title}
                  </h3>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium border',
                      getPriorityBadgeColor(announcement.priority),
                    )}
                  >
                    {getTypeLabel(announcement.type)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-line">
                  {announcement.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <span>
                    Lido em:{' '}
                    {announcement.readAt
                      ? formatDate(announcement.readAt)
                      : formatDate(announcement.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
