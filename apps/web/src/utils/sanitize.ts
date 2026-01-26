/**
 * Data sanitization utilities
 * Removes sensitive fields before storing in localStorage
 */

import { User } from '@/types/user';
import { Company } from '@/types/company';

/**
 * Sanitize user data - remove sensitive fields
 * Keep only essential data needed for UI
 */
export const sanitizeUser = (user: User | null): User | null => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    // Email removed - fetch from server when needed (e.g., /auth/me)
    // This reduces exposure of personal data
    email: '', // Placeholder - will be fetched from server
    role: user.role,
    status: user.status,
    companyIds: user.companyIds,
    avatar: user.avatar, // Keep avatar for UI display
    plan: user.plan, // Keep plan for UI display
    // Removed sensitive fields:
    // - email (fetch from server via getCurrentUser() when needed)
    // - emailVerified (can be fetched from server)
    // - createdAt (not needed for UI)
    // - updatedAt (not needed for UI)
    // - password (should never be stored)
  } as User;
};

/**
 * Sanitize company data - remove sensitive fields
 * Keep only essential data needed for UI
 */
export const sanitizeCompany = (company: Company | null): Company | null => {
  if (!company) return null;

  return {
    id: company.id,
    name: company.name,
    type: company.type,
    cnpj: '',
    foundationDate: company.foundationDate,
    userIds: company.userIds,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    documentType: company.documentType,
    pierreFinanceTenantId: company.pierreFinanceTenantId,
    openiTenantId: company.openiTenantId,
  } as Company;
};

/**
 * Sanitize transaction draft - remove sensitive financial data
 */
export const sanitizeTransactionDraft = (draft: unknown): unknown => {
  if (!draft || typeof draft !== 'object') return draft;

  const sanitized = { ...draft } as Record<string, unknown>;

  // Remove or mask sensitive fields
  if ('amount' in sanitized) {
    // Keep amount but could be masked in future
    // For now, we keep it as sessionStorage is cleared on tab close
  }

  if ('note' in sanitized && typeof sanitized.note === 'string') {
    // Truncate long notes to prevent storing excessive data
    if (sanitized.note.length > 500) {
      sanitized.note = sanitized.note.substring(0, 500);
    }
  }

  return sanitized;
};

/**
 * Check if data should be stored in localStorage or sessionStorage
 * Sensitive data should use sessionStorage (cleared on tab close)
 */
export const shouldUseSessionStorage = (key: string): boolean => {
  const sessionStorageKeys = ['transaction_draft', 'temp_', 'draft_'];

  return sessionStorageKeys.some((prefix) => key.startsWith(prefix));
};
