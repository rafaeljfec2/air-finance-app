import { useMemo, useState } from 'react';
import { Company } from '@/types/company';

function removeNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function useCompanyFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filterCompanies = useMemo(
    () => (companies: Company[]) => {
      return companies.filter((company) => {
        const matchesSearch =
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          removeNonDigits(company.cnpj).includes(removeNonDigits(searchTerm));
        const matchesType = filterType === 'all' || company.type === filterType;
        return matchesSearch && matchesType;
      });
    },
    [searchTerm, filterType],
  );

  const hasActiveFilters = useMemo(
    () => searchTerm !== '' || filterType !== 'all',
    [searchTerm, filterType],
  );

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCompanies,
    hasActiveFilters,
  };
}
