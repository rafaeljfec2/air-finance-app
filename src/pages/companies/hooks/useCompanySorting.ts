import { useSortable } from '@/hooks/useSortable';
import { Company } from '@/types/company';

export function useCompanySorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'name' | 'type' | 'cnpj' | 'foundationDate' | 'email' | 'phone' | 'address'
  >();

  const sortCompanies = (companies: Company[]): Company[] => {
    return sortData(companies as unknown as Record<string, unknown>[], (item, field) => {
      const company = item as unknown as Company;
      switch (field) {
        case 'name':
          return company.name;
        case 'type':
          return company.type;
        case 'cnpj':
          return company.cnpj;
        case 'foundationDate':
          return new Date(company.foundationDate);
        case 'email':
          return company.email ?? '';
        case 'phone':
          return company.phone ?? '';
        case 'address':
          return company.address ?? '';
        default:
          return (company as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as Company[];
  };

  return {
    sortConfig,
    handleSort,
    sortCompanies,
  };
}
