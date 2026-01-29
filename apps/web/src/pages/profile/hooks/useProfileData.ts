import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/toast';
import { getCurrentUser } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import {
  ProfileFormData,
  PreferencesData,
  NotificationsData,
  IntegrationsData,
  OpenaiModelType,
  DEFAULT_PROFILE_DATA,
  DEFAULT_PREFERENCES,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_INTEGRATIONS,
} from './types';

interface UseProfileDataReturn {
  readonly isLoading: boolean;
  readonly profileData: ProfileFormData;
  readonly preferences: PreferencesData;
  readonly notifications: NotificationsData;
  readonly integrations: IntegrationsData;
  readonly avatar: string;
  readonly setProfileData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  readonly setPreferences: React.Dispatch<React.SetStateAction<PreferencesData>>;
  readonly setNotifications: React.Dispatch<React.SetStateAction<NotificationsData>>;
  readonly setIntegrations: React.Dispatch<React.SetStateAction<IntegrationsData>>;
  readonly setAvatar: React.Dispatch<React.SetStateAction<string>>;
  readonly refetch: () => Promise<void>;
}

export function useProfileData(): UseProfileDataReturn {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData>(DEFAULT_PROFILE_DATA);
  const [preferences, setPreferences] = useState<PreferencesData>(DEFAULT_PREFERENCES);
  const [notifications, setNotifications] = useState<NotificationsData>(DEFAULT_NOTIFICATIONS);
  const [integrations, setIntegrations] = useState<IntegrationsData>(DEFAULT_INTEGRATIONS);
  const [avatar, setAvatar] = useState(user?.avatar ?? '/avatars/default.png');

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const fullUser = await getCurrentUser();

      setProfileData({
        name: fullUser.name ?? '',
        email: fullUser.email ?? '',
        phone: fullUser.phone ?? '',
        location: fullUser.location ?? '',
        bio: fullUser.bio ?? '',
      });

      setAvatar(fullUser.avatar ?? user.avatar ?? '/avatars/default.png');

      if (fullUser.preferences) {
        setPreferences({
          currency: fullUser.preferences.currency ?? 'BRL',
          language: fullUser.preferences.language ?? 'pt-BR',
          theme: fullUser.preferences.theme ?? 'system',
          dateFormat: fullUser.preferences.dateFormat ?? 'DD/MM/YYYY',
        });
      }

      if (fullUser.notifications) {
        setNotifications({
          email: fullUser.notifications.email ?? true,
          push: fullUser.notifications.push ?? true,
          updates: fullUser.notifications.updates ?? false,
          marketing: fullUser.notifications.marketing ?? false,
          security: fullUser.notifications.security ?? true,
        });
      }

      if (fullUser.integrations) {
        setIntegrations((prev) => ({
          ...prev,
          openaiModel: (fullUser.integrations?.openaiModel ?? 'gpt-4o-mini') as OpenaiModelType,
          hasOpenaiKey: fullUser.integrations?.hasOpenaiKey ?? false,
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do usuário',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.avatar]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    isLoading,
    profileData,
    preferences,
    notifications,
    integrations,
    avatar,
    setProfileData,
    setPreferences,
    setNotifications,
    setIntegrations,
    setAvatar,
    refetch: fetchUserData,
  };
}
