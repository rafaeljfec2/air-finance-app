import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getCurrentUser } from '@/services/authService';
import { updateUser, type CreateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/stores/useTheme';
import { mapUserServiceToUserType } from '@/utils/userMapper';
import { Bell, Bot, CreditCard, Palette, User } from 'lucide-react';
import {
  ProfilePersonalSection,
  ProfilePreferencesSection,
  ProfileNotificationsSection,
  ProfileIntegrationsSection,
  ProfileSubscriptionSection,
} from './components';

const VALID_TABS = [
  'personal',
  'preferences',
  'notifications',
  'integrations',
  'subscription',
] as const;
type TabValue = (typeof VALID_TABS)[number];

type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

type PreferencesData = {
  currency: string;
  language: string;
  theme: string;
  dateFormat: string;
};

type NotificationsData = {
  email: boolean;
  push: boolean;
  updates: boolean;
  marketing: boolean;
  security: boolean;
};

type OpenaiModelType = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

type IntegrationsData = {
  openaiApiKey: string;
  openaiModel: OpenaiModelType;
  hasOpenaiKey: boolean;
};

export function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, setUser } = useAuthStore();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingIntegrations, setIsSavingIntegrations] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar ?? '/avatars/default.png');

  const tabFromUrl = searchParams.get('tab') as TabValue | null;
  const defaultTab: TabValue = VALID_TABS.includes(tabFromUrl as TabValue)
    ? (tabFromUrl as TabValue)
    : 'personal';

  const handleTabChange = (value: string) => {
    if (value === 'personal') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', value);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  const [preferences, setPreferences] = useState<PreferencesData>({
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
  });

  const [notifications, setNotifications] = useState<NotificationsData>({
    email: true,
    push: true,
    updates: false,
    marketing: false,
    security: true,
  });

  const [integrations, setIntegrations] = useState<IntegrationsData>({
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    hasOpenaiKey: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const fullUser = await getCurrentUser();

        setFormData({
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
    };

    fetchUserData();
  }, [user?.id, user?.avatar]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao fazer upload do avatar',
        type: 'error',
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setIsSavingProfile(true);
    try {
      const updateData: Partial<CreateUser> & Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
      };

      const updatedUser = await updateUser(user.id, updateData);
      setUser(mapUserServiceToUserType(updatedUser));
      setIsEditing(false);
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar perfil',
        type: 'error',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    if (!user) return;

    setFormData({
      name: user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      location: user.location ?? '',
      bio: user.bio ?? '',
    });
    setAvatar(user.avatar ?? '/avatars/default.png');
    setIsEditing(false);
  };

  const handlePreferencesChange = (key: keyof PreferencesData, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));

    if (key === 'theme') {
      setTheme(value === 'dark');
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;

    setIsSavingPreferences(true);
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
      setIsSavingPreferences(false);
    }
  };

  const handleToggleNotification = (key: keyof NotificationsData) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async () => {
    if (!user?.id) return;

    setIsSavingNotifications(true);
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
      setIsSavingNotifications(false);
    }
  };

  const handleIntegrationsChange = (key: keyof IntegrationsData, value: string | boolean) => {
    setIntegrations((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveIntegrations = async () => {
    if (!user?.id) return;

    setIsSavingIntegrations(true);
    try {
      const updateData = { integrations: { ...integrations } };
      const updatedUser = await updateUser(user.id, updateData);
      setUser(mapUserServiceToUserType(updatedUser));
      toast({
        title: 'Sucesso',
        description: 'Integrações atualizadas com sucesso!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar integrações',
        type: 'error',
      });
    } finally {
      setIsSavingIntegrations(false);
    }
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="text-primary-500" />
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-text dark:text-text-dark">Minha Conta</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie suas informações pessoais, preferências e integrações
            </p>
          </div>

          <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Pessoal</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Preferências</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2">
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Integrações</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Assinatura</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <ProfilePersonalSection
                formData={formData}
                avatar={avatar}
                userId={user?.id}
                isEditing={isEditing}
                isSaving={isSavingProfile}
                onFormChange={handleFormChange}
                onAvatarChange={handleAvatarChange}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
                onStartEditing={() => setIsEditing(true)}
              />
            </TabsContent>

            <TabsContent value="preferences">
              <ProfilePreferencesSection
                preferences={preferences}
                isSaving={isSavingPreferences}
                onChange={handlePreferencesChange}
                onSave={handleSavePreferences}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <ProfileNotificationsSection
                notifications={notifications}
                isSaving={isSavingNotifications}
                onToggle={handleToggleNotification}
                onSave={handleSaveNotifications}
              />
            </TabsContent>

            <TabsContent value="integrations">
              <ProfileIntegrationsSection
                integrations={integrations}
                isSaving={isSavingIntegrations}
                onChange={handleIntegrationsChange}
                onSave={handleSaveIntegrations}
              />
            </TabsContent>

            <TabsContent value="subscription">
              <ProfileSubscriptionSection userId={user?.id} userPlan={user?.plan} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ViewDefault>
  );
}
