import React, { createContext, useContext } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '@/hooks/useCompanies';

type CompanyState = {
  companyId: string;
  setCompanyId: (id: string) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
};

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

const CompanyContext = createContext<ReturnType<typeof useCompanyStore> | null>(null);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useCompanyStore();
  return <CompanyContext.Provider value={store}>{children}</CompanyContext.Provider>;
};

export const useCompanyContext = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompanyContext must be used within CompanyProvider');
  return ctx;
};
