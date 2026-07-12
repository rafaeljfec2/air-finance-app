import { useSearchParams } from 'react-router-dom';

import { FormSkeleton } from '@/components/skeletons';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useAuthStore } from '@/stores/auth';

import {
  ProfilePersonalSection,
  ProfilePreferencesSection,
  ProfileNotificationsSection,
  ProfileIntegrationsSection,
  ProfileApiTokensSection,
  ProfileSubscriptionSection,
  ProfileHeader,
  ProfileTabsNav,
} from './components';
import {
  isProfileTab,
  resolveProfileTab,
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

  const activeTab = resolveProfileTab(searchParams.get('tab'));

  const handleTabChange = (value: string) => {
    if (!isProfileTab(value)) {
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (value === 'personal') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }
    setSearchParams(params, { replace: true });
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <FormSkeleton title="Perfil" fields={6} />
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <ProfileHeader userName={user?.name} />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <ProfileTabsNav />

            <TabsContent value="personal" className="mt-0 space-y-6">
              <ProfilePersonalSection
                formData={profileData}
                avatar={avatar}
                accountMeta={{
                  plan: user?.plan,
                  role: user?.role,
                  emailVerified: user?.emailVerified,
                  companyCount: user?.companyIds?.length ?? 0,
                  memberSince: user?.createdAt,
                }}
                isEditing={personal.isEditing}
                isSaving={personal.isSaving}
                onAvatarChange={personal.handleAvatarChange}
                onSave={personal.handleSave}
                onCancel={personal.handleCancel}
                onStartEditing={personal.startEditing}
              />
            </TabsContent>

            <TabsContent value="preferences" className="mt-0 space-y-6">
              <ProfilePreferencesSection
                preferences={preferences}
                isSaving={preferencesSection.isSaving}
                onChange={preferencesSection.handleChange}
                onSave={preferencesSection.handleSave}
              />
              <ProfileNotificationsSection
                notifications={notifications}
                isSaving={notificationsSection.isSaving}
                onToggle={notificationsSection.handleToggle}
              />
            </TabsContent>

            <TabsContent value="subscription" className="mt-0 space-y-6">
              <ProfileSubscriptionSection />
            </TabsContent>

            <TabsContent value="developer" className="mt-0 space-y-6">
              <ProfileIntegrationsSection
                integrations={integrations}
                isSaving={integrationsSection.isSaving}
                onChange={integrationsSection.handleChange}
                onSave={integrationsSection.handleSave}
              />
              <ProfileApiTokensSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ViewDefault>
  );
}
