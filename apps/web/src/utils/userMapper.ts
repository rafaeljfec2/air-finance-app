import { User as UserType, UserRole, UserStatus, UserPlan, UserCurrency, UserLanguage, UserTheme, UserDateFormat, OpenaiModel } from '@/types/user';
import { User as ApiUser } from '@/services/userService';

export function mapUserServiceToUserType(apiUser: ApiUser): UserType {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role as UserRole,
    status: apiUser.status as UserStatus,
    plan: (apiUser.plan ?? 'free') as UserPlan,
    companyIds: apiUser.companyIds,
    avatar: (apiUser as Record<string, unknown>).avatar as string | undefined,
    phone: (apiUser as Record<string, unknown>).phone as string | undefined,
    location: (apiUser as Record<string, unknown>).location as string | undefined,
    bio: (apiUser as Record<string, unknown>).bio as string | undefined,
    onboardingCompleted: apiUser.onboardingCompleted,
    emailVerified: apiUser.emailVerified,
    notifications: apiUser.notifications,
    preferences: apiUser.preferences
      ? {
          currency: apiUser.preferences.currency as UserCurrency,
          language: apiUser.preferences.language as UserLanguage,
          theme: apiUser.preferences.theme as UserTheme,
          dateFormat: apiUser.preferences.dateFormat as UserDateFormat,
        }
      : undefined,
    integrations: apiUser.integrations
      ? {
          ...apiUser.integrations,
          openaiModel: apiUser.integrations.openaiModel as OpenaiModel | undefined,
        }
      : undefined,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    companyRoles: apiUser.companyRoles,
  };
}
