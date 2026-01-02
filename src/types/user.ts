export type UserRole =
  | 'god'
  | 'admin'
  | 'user'
  | 'sys_admin'
  | 'operator'
  | 'owner'
  | 'editor'
  | 'viewer';

export type UserStatus = 'active' | 'inactive';

export interface UserNotifications {
  email: boolean;
  push: boolean;
  updates: boolean;
  marketing: boolean;
  security: boolean;
}

export type UserCurrency = 'BRL' | 'USD' | 'EUR';
export type UserLanguage = 'pt-BR' | 'en-US' | 'es-ES';
export type UserTheme = 'light' | 'dark' | 'system';
export type UserDateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

export interface UserPreferences {
  currency: UserCurrency;
  language: UserLanguage;
  theme: UserTheme;
  dateFormat: UserDateFormat;
}

export interface UserIntegrations {
  openaiApiKey?: string;
  openaiModel?: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-5.2' | 'gpt-5-mini';
}

export type UserPlan = 'free' | 'pro' | 'business';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  plan: UserPlan;
  companyIds: string[];
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  onboardingCompleted?: boolean;
  emailVerified?: boolean;
  notifications?: UserNotifications;
  preferences?: UserPreferences;
  integrations?: UserIntegrations;
  createdAt: string;
  updatedAt: string;
  companyRoles?: Record<string, string>;
};
