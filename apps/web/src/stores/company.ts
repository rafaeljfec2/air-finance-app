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
        activeCompany: state.activeCompany
          ? {
              id: state.activeCompany.id,
              name: state.activeCompany.name,
              type: state.activeCompany.type,
              documentType: state.activeCompany.documentType,
              foundationDate: state.activeCompany.foundationDate,
              // Explicitly exclude userIds to prevent leakage
              createdAt: state.activeCompany.createdAt,
              updatedAt: state.activeCompany.updatedAt,
            }
          : null,
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
