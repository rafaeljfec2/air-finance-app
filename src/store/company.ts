import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '@/types';

interface CompanyStore {
  activeCompany: Company | null;
  setActiveCompany: (company: Company | null) => void;
  clearActiveCompany: () => void;
}

const initialState: Pick<CompanyStore, 'activeCompany'> = {
  activeCompany: null,
};

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      ...initialState,
      setActiveCompany: (company) => set({ activeCompany: company }),
      clearActiveCompany: () => set({ activeCompany: null }),
    }),
    {
      name: 'company-storage',
    },
  ),
);
