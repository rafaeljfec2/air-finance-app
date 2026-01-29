import React, { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';
import type { NotificationsData } from './types';

interface UseProfileNotificationsParams {
  readonly notifications: NotificationsData;
  readonly setNotifications: React.Dispatch<React.SetStateAction<NotificationsData>>;
}

interface UseProfileNotificationsReturn {
  readonly isSaving: boolean;
  readonly handleToggle: (key: keyof NotificationsData) => void;
  readonly handleSave: () => Promise<void>;
}

export function useProfileNotifications({
  notifications,
  setNotifications,
}: UseProfileNotificationsParams): UseProfileNotificationsReturn {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback(
    (key: keyof NotificationsData) => {
      setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [setNotifications],
  );

  const handleSave = useCallback(async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const updateData = { notifications: { ...notifications } };
      const updatedUser = await updateUser(user.id, updateData);
      setUser(mapUserServiceToUserType(updatedUser));
      toast({
        title: 'Sucesso',
        description: 'Notificações atualizadas com sucesso!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar notificações',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, notifications, setUser]);

  return {
    isSaving,
    handleToggle,
    handleSave,
  };
}
