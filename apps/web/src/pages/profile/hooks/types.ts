export interface ProfileFormData {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly bio: string;
}

export interface PreferencesData {
  readonly currency: string;
  readonly language: string;
  readonly theme: string;
  readonly dateFormat: string;
}

export interface NotificationsData {
  readonly email: boolean;
  readonly push: boolean;
  readonly updates: boolean;
  readonly marketing: boolean;
  readonly security: boolean;
}

export type OpenaiModelType = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

export interface IntegrationsData {
  readonly openaiApiKey: string;
  readonly openaiModel: OpenaiModelType;
  readonly hasOpenaiKey: boolean;
}

export const VALID_TABS = [
  'personal',
  'preferences',
  'notifications',
  'integrations',
  'subscription',
] as const;

export type TabValue = (typeof VALID_TABS)[number];

export const DEFAULT_PROFILE_DATA: ProfileFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
};

export const DEFAULT_PREFERENCES: PreferencesData = {
  currency: 'BRL',
  language: 'pt-BR',
  theme: 'system',
  dateFormat: 'DD/MM/YYYY',
};

export const DEFAULT_NOTIFICATIONS: NotificationsData = {
  email: true,
  push: true,
  updates: false,
  marketing: false,
  security: true,
};

export const DEFAULT_INTEGRATIONS: IntegrationsData = {
  openaiApiKey: '',
  openaiModel: 'gpt-4o-mini',
  hasOpenaiKey: false,
};
