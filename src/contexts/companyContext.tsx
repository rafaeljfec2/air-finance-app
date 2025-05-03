import React, { createContext, useContext } from 'react';
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

  // MOCK: Adiciona empresas fictícias se a lista estiver vazia
  if (store.companies.length === 0) {
    store.setCompanies([
      {
        id: '1',
        name: 'Empresa Exemplo 1',
        cnpj: '00.000.000/0001-00',
        type: 'matriz',
        foundationDate: '2020-01-01',
        email: 'contato@exemplo1.com',
        phone: '(11) 99999-0001',
        address: 'Rua Exemplo, 123',
        notes: 'Empresa mockada para testes.',
        userId: '1',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
      },
      {
        id: '2',
        name: 'Empresa Exemplo 2',
        cnpj: '00.000.000/0002-00',
        type: 'filial',
        foundationDate: '2021-05-10',
        email: 'contato@exemplo2.com',
        phone: '(21) 98888-0002',
        address: 'Avenida Teste, 456',
        notes: 'Segunda empresa mockada.',
        userId: '1',
        createdAt: '2021-05-10',
        updatedAt: '2021-05-10',
      },
    ]);
    store.setCompanyId('1');
  }

  const selectedCompany = store.companies.find((company) => company.id === store.companyId) || null;

  const value: CompanyContextValue = {
    ...store,
    selectedCompany,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export const useCompanyContext = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompanyContext must be used within CompanyProvider');
  return ctx;
};
