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
      partialize: (state) => ({
        companyId: state.companyId,
        // Store only minimal company data (IDs and names)
        companies: state.companies.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
        })) as Company[],
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sanitize on rehydration
        if (state?.companies) {
          state.companies = state.companies.map((c) => sanitizeCompany(c) as Company);
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
