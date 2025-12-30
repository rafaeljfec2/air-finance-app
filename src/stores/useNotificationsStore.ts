import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'system' | 'budget' | 'bill' | 'security' | 'success' | 'warning' | 'error' | 'info';

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
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'budget',
    title: 'Limite atingido',
    message: 'Você atingiu 90% do limite do cartão Nubank.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: '2',
    type: 'bill',
    title: 'Fatura próxima do vencimento',
    message: 'Sua fatura do Itaú vence amanhã. Valor: R$ 3.049,18',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    type: 'system',
    title: 'Bem-vindo ao AirFinance!',
    message: 'Seu perfil foi configurado com sucesso. Aproveite todas as funcionalidades.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '4',
    type: 'security',
    title: 'Novo acesso detectado',
    message: 'Um novo login foi realizado via Chrome em São Paulo, BR.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,

      addNotification: (data) => {
        const newNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          read: false,
          ...data,
        };

        set((state) => {
          const updatedNotifications = [newNotification, ...state.notifications];
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) => ({ ...n, read: true }));
          return {
            notifications: updatedNotifications,
            unreadCount: 0,
          };
        });
      },

      removeNotification: (id) => {
         set((state) => {
          const updatedNotifications = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },
    }),
    {
      name: 'airfinance-notifications-storage',
    }
  )
);
