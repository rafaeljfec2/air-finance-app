import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '@/types';
import { sanitizeCompany } from '@/utils/sanitize';

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
      // Security: Sanitization is applied, expiration will be added via periodic cleanup
      // Temporarily using default storage to avoid serialization issues
      // TODO: Re-enable secure storage after fixing serialization issues
      // storage: createSecureStorage('company-storage', {
      //   encrypt: false,
      //   ttl: STORAGE_CONFIG.COMPANY_TTL,
      //   monitor: true,
      // }),
      // Security: Only store essential fields, sensitive data removed via sanitization
      // CNPJ and other sensitive fields should be fetched from server when needed
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
              // Sensitive fields removed: cnpj, email, phone, address, notes
              // These should be fetched from server via companyService when needed
            }
          : null,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sanitize on rehydration
        if (state?.activeCompany) {
          state.activeCompany = sanitizeCompany(state.activeCompany);
        }
      },
    },
  ),
);
