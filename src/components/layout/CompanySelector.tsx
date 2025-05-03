import React from 'react';
import { useCompanyContext } from '@/contexts/companyContext';
import { BuildingOfficeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Company } from '@/hooks/useCompanies';

export const CompanySelector: React.FC = () => {
  const { companies, companyId, setCompanyId } = useCompanyContext() as {
    companies: Company[];
    companyId: string;
    setCompanyId: (id: string) => void;
  };

  if (!companies || companies.length === 0) return null;
  if (companies.length === 1) {
    // Se só tem uma empresa, já seleciona e não mostra o seletor
    if (companyId !== companies[0].id) setCompanyId(companies[0].id);
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded bg-card dark:bg-card-dark border border-border dark:border-border-dark">
        <BuildingOfficeIcon className="h-5 w-5 text-primary-500" />
        <span className="text-sm">{companies[0].name}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        className="appearance-none bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded px-3 py-1 pr-8 text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      >
        <option value="">Selecione a empresa...</option>
        {companies.map((c: Company) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};
