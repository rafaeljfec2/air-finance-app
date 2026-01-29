import React, { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/stores/useTheme';
import { mapUserServiceToUserType } from '@/utils/userMapper';
import type { PreferencesData } from './types';

interface UseProfilePreferencesParams {
  readonly preferences: PreferencesData;
  readonly setPreferences: React.Dispatch<React.SetStateAction<PreferencesData>>;
}

interface UseProfilePreferencesReturn {
  readonly isSaving: boolean;
  readonly handleChange: (key: keyof PreferencesData, value: string) => void;
  readonly handleSave: () => Promise<void>;
}

export function useProfilePreferences({
  preferences,
  setPreferences,
}: UseProfilePreferencesParams): UseProfilePreferencesReturn {
  const { user, setUser } = useAuthStore();
  const { setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (key: keyof PreferencesData, value: string) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));

      if (key === 'theme') {
        setTheme(value === 'dark');
      }
    },
    [setPreferences, setTheme],
  );

  const handleSave = useCallback(async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const updateData = { preferences: { ...preferences } };
      const updatedUser = await updateUser(
        user.id,
        updateData as unknown as Parameters<typeof updateUser>[1],
      );
      setUser(mapUserServiceToUserType(updatedUser));
      toast({
        title: 'Sucesso',
        description: 'Preferências atualizadas com sucesso!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar preferências',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, preferences, setUser]);

  return {
    isSaving,
    handleChange,
    handleSave,
  };
}
