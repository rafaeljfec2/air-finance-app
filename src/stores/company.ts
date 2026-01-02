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
      partialize: (state) => ({
        activeCompany: state.activeCompany
          ? {
              id: state.activeCompany.id,
              name: state.activeCompany.name,
              type: state.activeCompany.type,
              foundationDate: state.activeCompany.foundationDate,
              userIds: state.activeCompany.userIds,
              createdAt: state.activeCompany.createdAt,
              updatedAt: state.activeCompany.updatedAt,
            }
          : null,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sanitize on rehydration
        if (state?.activeCompany) {
          // Validate that activeCompany has at least an id, otherwise clear it
          if (!state.activeCompany.id) {
            state.activeCompany = null;
          } else {
            state.activeCompany = sanitizeCompany(state.activeCompany);
          }
        }
      },
    },
  ),
);
