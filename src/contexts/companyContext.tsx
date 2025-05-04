import React, { createContext, useContext, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '@/hooks/useCompanies';

interface CompanyState {
  companyId: string;
  setCompanyId: (id: string) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
}

interface CompanyContextValue extends CompanyState {
  selectedCompany: Company | null;
}

const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companyId: '',
      setCompanyId: (id) => set({ companyId: id }),
      companies: [],
      setCompanies: (companies) => set({ companies }),
    }),
    { name: '@air-finance:company' },
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

export const useCompanyContext = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompanyContext must be used within CompanyProvider');
  return ctx;
};
