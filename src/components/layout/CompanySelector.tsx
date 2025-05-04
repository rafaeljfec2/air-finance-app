import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuthStore } from '@/store/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Loading } from '@/components/Loading';
import { ChevronDown } from 'lucide-react';

export const CompanySelector = () => {
  const { user } = useAuthStore();
  const { activeCompany, changeActiveCompany } = useActiveCompany();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: companies,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => companyService.getUserCompanies(),
    enabled: !!user,
  });

  // Garante que a query de empresas seja executada após login
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  // LOGS DE DEPURAÇÃO
  console.log('CompanySelector montado');
  console.log('User:', user);
  console.log('Companies:', companies);
  console.log('isLoading:', isLoading);
  console.log('error:', error);

  if (!user) return null;

  if (isLoading) {
    return <Loading size="small" />;
  }

  if (!companies?.length) {
    return <div className="text-sm text-gray-500">Nenhuma empresa cadastrada</div>;
  }

  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find((company: Company) => company.id === companyId);
    changeActiveCompany(selectedCompany || null);
  };

  return (
    <Select value={activeCompany?.id || ''} onValueChange={handleCompanyChange}>
      <SelectTrigger className="min-w-[220px] h-12 px-4 bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md flex items-center justify-between shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
        <div className="flex flex-col items-start flex-1">
          <span className="font-bold text-text dark:text-text-dark leading-tight">
            {activeCompany?.name || 'Selecione uma empresa'}
          </span>
          {activeCompany?.cnpj && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{activeCompany.cnpj}</span>
          )}
        </div>
        <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
      </SelectTrigger>
      <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md shadow-lg p-1">
        {companies.map((company: Company) => (
          <SelectItem
            key={company.id}
            value={company.id}
            className="flex flex-col px-4 py-2 rounded hover:bg-primary-50 dark:hover:bg-primary-900 focus:bg-primary-100 dark:focus:bg-primary-900"
          >
            <span className="font-medium">{company.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{company.cnpj}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
