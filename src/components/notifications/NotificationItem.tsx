import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/stores/useNotificationsStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, CheckCircle, Info, Shield, Wallet, XCircle } from 'lucide-react';
import React from 'react';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'WARNING':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'SUCCESS':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'ERROR':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'BUDGET':
      return <Wallet className="h-5 w-5 text-primary-500" />;
    case 'BILL':
      return <Wallet className="h-5 w-5 text-red-500" />;
    case 'SECURITY':
      return <Shield className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const Component = onClick ? 'button' : 'div';
  const componentProps = onClick
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        type: 'button' as const,
        'aria-label': `Notificação: ${notification.title}`,
        className: cn(
          'w-full text-left px-4 py-3 flex gap-3 cursor-pointer transition-colors border-b border-border/50 dark:border-border-dark/50 last:border-0',
          notification.read
            ? 'hover:bg-muted/50 dark:hover:bg-gray-800/50'
            : 'bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-100/50 dark:hover:bg-primary-900/20',
        ),
      }
    : {
        className: cn(
          'px-4 py-3 flex gap-3 border-b border-border/50 dark:border-border-dark/50 last:border-0',
          notification.read ? '' : 'bg-primary-50/50 dark:bg-primary-900/10',
        ),
      };

  return (
    <Component {...componentProps}>
      <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h4
            className={cn(
              'text-sm font-medium leading-none truncate pr-2 text-text dark:text-text-dark',
              !notification.read && 'font-semibold',
            )}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {notification.message}
        </p>
      </div>
      {!notification.read && (
        <div className="flex items-center self-center">
          <div className="h-2 w-2 rounded-full bg-primary-500"></div>
        </div>
      )}
    </Component>
  );
};
