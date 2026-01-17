import { Company } from '@/types/company';
import { sanitizeCompany } from '@/utils/sanitize';
import React, { createContext, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanyState {
  companyId: string;
  setCompanyId: (id: string) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
}

interface CompanyContextValue extends CompanyState {
  selectedCompany: Company | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companyId: '',
      setCompanyId: (id) => set({ companyId: id }),
      companies: [],
      setCompanies: (companies) =>
        set({
          // Security: Sanitize companies before storing
          companies: companies.map((c) => sanitizeCompany(c) ?? c),
        }),
    }),
    {
      name: '@air-finance:company',
      // Security: Only store company IDs and essential fields
      // NEVER store userIds to prevent data leaks between users
      partialize: (state) => ({
        companyId: state.companyId,
        // Store only minimal company data (IDs and names) - NO userIds
        companies: state.companies.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          // Explicitly exclude userIds to prevent leakage
        })) as Company[],
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sanitize on rehydration
        if (state?.companies) {
          state.companies = state.companies.map((c) => {
            const sanitized = sanitizeCompany(c) as Company;
            // Extra security: remove userIds if somehow present
            if (sanitized && 'userIds' in sanitized) {
              delete (sanitized as any).userIds;
            }
            return sanitized;
          });
        }
      },
    },
  ),
);

const CompanyContext = createContext<CompanyContextValue | null>(null);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useCompanyStore();
  const selectedCompany = store.companies.find((company) => company.id === store.companyId) || null;

  const value = useMemo(
    () => ({
      ...store,
      selectedCompany,
    }),
    [store, selectedCompany],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
