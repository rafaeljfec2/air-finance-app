import React, { useState, useCallback } from 'react';

import { toast } from '@/components/ui/toast';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';

import type { ProfileNotificationsFormValues } from '../schemas';

import type { NotificationsData } from './types';

interface UseProfileNotificationsParams {
  readonly notifications: NotificationsData;
  readonly setNotifications: React.Dispatch<React.SetStateAction<NotificationsData>>;
}

interface UseProfileNotificationsReturn {
  readonly isSaving: boolean;
  readonly handleToggle: (key: keyof NotificationsData) => Promise<void>;
}

export function useProfileNotifications({
  notifications,
  setNotifications,
}: UseProfileNotificationsParams): UseProfileNotificationsReturn {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback(
    async (key: keyof NotificationsData) => {
      if (!user?.id || isSaving) return;

      const previous = notifications;
      const next: ProfileNotificationsFormValues = {
        ...notifications,
        [key]: !notifications[key],
      };

      setNotifications(next);
      setIsSaving(true);
      try {
        const updatedUser = await updateUser(user.id, { notifications: next });
        setUser(mapUserServiceToUserType(updatedUser));
      } catch (error) {
        console.error(error);
        setNotifications(previous);
        toast({
          title: 'Erro',
          description: 'Não foi possível salvar a notificação. Tente de novo.',
          type: 'error',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id, notifications, setNotifications, setUser, isSaving],
  );

  return {
    isSaving,
    handleToggle,
  };
}
