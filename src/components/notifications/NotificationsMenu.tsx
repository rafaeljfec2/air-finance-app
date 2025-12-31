import { useAuth } from '@/hooks/useAuth';
import { useNotificationsStore } from '@/stores/useNotificationsStore';
import { Menu, Transition } from '@headlessui/react';
import { Bell, CheckCheck } from 'lucide-react';
import { Fragment, useEffect } from 'react';
import { NotificationItem } from './NotificationItem';

export function NotificationsMenu() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotificationsStore();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id, fetchNotifications]);

  const handleNotificationClick = (id: string) => {
    if (user?.id) {
      markAsRead(id, user.id);
      // Future: navigation logic based on notification type
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.id) {
      markAllAsRead(user.id);
    }
  };

  return (
    <Menu as="div" className="relative">
      {() => (
        <>
          <Menu.Button className="relative p-1.5 sm:p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <span className="sr-only">Ver notificações</span>
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] sm:text-xs text-white font-bold animate-in zoom-in duration-200">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-lg bg-card dark:bg-card-dark shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-sm text-text dark:text-text-dark">Notificações</h3>
                {unreadCount > 0 && (
                   <button 
                     onClick={handleMarkAllRead}
                     className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 font-medium transition-colors"
                   >
                     <CheckCheck className="h-3 w-3" />
                     Marcar todas como lidas
                   </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma notificação por enquanto.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50 dark:divide-border-dark/50">
                        {notifications.map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                                <div className={active ? 'bg-muted/50' : ''}>
                                    <NotificationItem 
                                        notification={notification} 
                                        onClick={() => handleNotificationClick(notification.id)}
                                    />
                                </div>
                            )}
                          </Menu.Item>
                        ))}
                    </div>
                )}
              </div>
              
              <div className="p-2 border-t border-border dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 text-center">
                  <button className="text-xs text-gray-500 hover:text-primary-500 transition-colors w-full py-1">
                      Ver histórico completo
                  </button>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
