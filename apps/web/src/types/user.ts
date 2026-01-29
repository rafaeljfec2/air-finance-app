export enum UserRole {
  GOD = 'god',
  ADMIN = 'admin',
  USER = 'user',
  SYS_ADMIN = 'sys_admin',
  OPERATOR = 'operator',
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface UserNotifications {
  email: boolean;
  push: boolean;
  updates: boolean;
  marketing: boolean;
  security: boolean;
}

export enum UserCurrency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export enum UserLanguage {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES',
}

export enum UserTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum UserDateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  MM_DD_YYYY = 'MM/DD/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
}

export interface UserPreferences {
  currency: UserCurrency;
  language: UserLanguage;
  theme: UserTheme;
  dateFormat: UserDateFormat;
}

export enum OpenaiModel {
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4O = 'gpt-4o',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
}

export interface UserIntegrations {
  openaiModel?: OpenaiModel;
  hasOpenaiKey?: boolean;
}

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business',
}

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
