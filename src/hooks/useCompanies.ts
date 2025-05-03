import { useState } from 'react';

export type Company = {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  foundationDate: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
};

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  const addCompany = async (company: Omit<Company, 'id'>) => {
    const newCompany = {
      ...company,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCompanies((prev) => [...prev, newCompany]);
    return newCompany;
  };

  const updateCompany = async (id: string, company: Omit<Company, 'id'>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...company, id } : c)));
  };

  const deleteCompany = async (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
  };
};
