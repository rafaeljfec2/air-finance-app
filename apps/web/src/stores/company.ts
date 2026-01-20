import { Company } from '@/types';
import { sanitizeCompany } from '@/utils/sanitize';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanyStore {
  activeCompany: Company | null;
  setActiveCompany: (company: Company | null) => void;
  clearActiveCompany: () => void;
}

const initialState: Pick<CompanyStore, 'activeCompany'> = {
  activeCompany: null,
};

/**
 * Removes sensitive fields from company data before persisting to localStorage
 * 
 * This function automatically includes ALL company fields except userIds.
 * New fields added to the Company interface (like pierreFinanceTenantId) 
 * are automatically included in localStorage without code changes.
 * 
 * @param company - The company object to sanitize for storage
 * @returns Company object without sensitive fields (userIds removed)
 */
function sanitizeCompanyForStorage(company: Company | null): Partial<Company> | null {
  if (!company) return null;

  // Create a copy and remove sensitive fields (userIds is intentionally unused)
  // The spread operator automatically includes all fields like:
  // - id, name, cnpj, documentType, type, foundationDate, etc.
  // - pierreFinanceTenantId (automatically included)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userIds, ...safeCompany } = company;
  return safeCompany;
}

/**
 * Custom storage with encryption for sensitive company data
 * Note: Encryption is complex with Zustand persist, so we'll use sanitization instead
 * For full encryption, consider implementing at the API level or using HttpOnly cookies
 */
export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      ...initialState,
      setActiveCompany: (company) => set({ activeCompany: sanitizeCompany(company) }),
      clearActiveCompany: () => set({ activeCompany: null }),
    }),
    {
      name: 'company-storage',
      // Security: NEVER store userIds to prevent data leaks between users
      partialize: (state) => ({
        activeCompany: sanitizeCompanyForStorage(state.activeCompany),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.activeCompany?.id) {
          const sanitized = sanitizeCompany(state.activeCompany);
          // Extra security: remove userIds if somehow present
          if (sanitized && 'userIds' in sanitized) {
            delete (sanitized as unknown as Record<string, unknown>).userIds;
          }
          state.activeCompany = sanitized;
        } else if (state?.activeCompany) {
          state.activeCompany = null;
        }
      },
    },
  ),
);
