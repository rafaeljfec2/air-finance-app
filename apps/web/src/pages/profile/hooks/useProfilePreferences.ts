import React, { useState, useCallback } from 'react';

import { toast } from '@/components/ui/toast';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { useTheme, type ThemePreference } from '@/stores/useTheme';
import { mapUserServiceToUserType } from '@/utils/userMapper';

import type { ProfilePreferencesFormValues } from '../schemas';

import type { PreferencesData } from './types';

interface UseProfilePreferencesParams {
  readonly preferences: PreferencesData;
  readonly setPreferences: React.Dispatch<React.SetStateAction<PreferencesData>>;
}

interface UseProfilePreferencesReturn {
  readonly isSaving: boolean;
  readonly handleChange: (key: keyof PreferencesData, value: string) => void;
  readonly handleSave: (values?: ProfilePreferencesFormValues) => Promise<void>;
}

function isThemePreference(value: string): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function withPreferenceField(
  prev: PreferencesData,
  key: keyof PreferencesData,
  value: string,
): PreferencesData {
  switch (key) {
    case 'currency':
      if (value === 'BRL' || value === 'USD' || value === 'EUR') {
        return { ...prev, currency: value };
      }
      return prev;
    case 'language':
      if (value === 'pt-BR' || value === 'en-US' || value === 'es-ES') {
        return { ...prev, language: value };
      }
      return prev;
    case 'theme':
      if (isThemePreference(value)) {
        return { ...prev, theme: value };
      }
      return prev;
    case 'dateFormat':
      if (value === 'DD/MM/YYYY' || value === 'MM/DD/YYYY' || value === 'YYYY-MM-DD') {
        return { ...prev, dateFormat: value };
      }
      return prev;
    default:
      return prev;
  }
}

export function useProfilePreferences({
  preferences,
  setPreferences,
}: UseProfilePreferencesParams): UseProfilePreferencesReturn {
  const { user, setUser } = useAuthStore();
  const { setPreference } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (key: keyof PreferencesData, value: string) => {
      setPreferences((prev) => withPreferenceField(prev, key, value));

      if (key === 'theme' && isThemePreference(value)) {
        setPreference(value);
      }
    },
    [setPreferences, setPreference],
  );

  const handleSave = useCallback(
    async (values?: ProfilePreferencesFormValues) => {
      if (!user?.id) return;

      const payload = values ?? preferences;
      setIsSaving(true);
      try {
        const updatedUser = await updateUser(user.id, {
          preferences: {
            currency: payload.currency,
            language: payload.language,
            theme: payload.theme,
            dateFormat: payload.dateFormat,
          },
        });
        setUser(mapUserServiceToUserType(updatedUser));
        setPreferences(payload);
        if (isThemePreference(payload.theme)) {
          setPreference(payload.theme);
        }
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
    },
    [user?.id, preferences, setUser, setPreferences, setPreference],
  );

  return {
    isSaving,
    handleChange,
    handleSave,
  };
}
