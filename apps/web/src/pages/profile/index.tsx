import { useSearchParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useAuthStore } from '@/stores/auth';
import { Bell, Bot, CreditCard, Palette, User } from 'lucide-react';
import {
  ProfilePersonalSection,
  ProfilePreferencesSection,
  ProfileNotificationsSection,
  ProfileIntegrationsSection,
  ProfileSubscriptionSection,
} from './components';
import {
  VALID_TABS,
  TabValue,
  useProfileData,
  useProfilePersonal,
  useProfilePreferences,
  useProfileNotifications,
  useProfileIntegrations,
} from './hooks';

export function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();

  const {
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
  } = useProfileData();

  const personal = useProfilePersonal({
    profileData,
    setProfileData,
    avatar,
    setAvatar,
  });

  const preferencesSection = useProfilePreferences({
    preferences,
    setPreferences,
  });

  const notificationsSection = useProfileNotifications({
    notifications,
    setNotifications,
  });

  const integrationsSection = useProfileIntegrations({
    integrations,
    setIntegrations,
  });

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
                formData={profileData}
                avatar={avatar}
                userId={user?.id}
                isEditing={personal.isEditing}
                isSaving={personal.isSaving}
                onFormChange={personal.handleFormChange}
                onAvatarChange={personal.handleAvatarChange}
                onSave={personal.handleSave}
                onCancel={personal.handleCancel}
                onStartEditing={personal.startEditing}
              />
            </TabsContent>

            <TabsContent value="preferences">
              <ProfilePreferencesSection
                preferences={preferences}
                isSaving={preferencesSection.isSaving}
                onChange={preferencesSection.handleChange}
                onSave={preferencesSection.handleSave}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <ProfileNotificationsSection
                notifications={notifications}
                isSaving={notificationsSection.isSaving}
                onToggle={notificationsSection.handleToggle}
                onSave={notificationsSection.handleSave}
              />
            </TabsContent>

            <TabsContent value="integrations">
              <ProfileIntegrationsSection
                integrations={integrations}
                isSaving={integrationsSection.isSaving}
                onChange={integrationsSection.handleChange}
                onSave={integrationsSection.handleSave}
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
