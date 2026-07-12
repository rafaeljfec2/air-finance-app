export const PROFILE_TABS = ['personal', 'preferences', 'subscription', 'developer'] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number];

const TAB_ALIASES: Record<string, ProfileTab> = {
  personal: 'personal',
  preferences: 'preferences',
  notifications: 'preferences',
  subscription: 'subscription',
  developer: 'developer',
  integrations: 'developer',
  'api-tokens': 'developer',
};

export function isProfileTab(value: string): value is ProfileTab {
  return (PROFILE_TABS as readonly string[]).includes(value);
}

export function resolveProfileTab(tabFromUrl: string | null): ProfileTab {
  if (!tabFromUrl) {
    return 'personal';
  }

  return TAB_ALIASES[tabFromUrl] ?? 'personal';
}
