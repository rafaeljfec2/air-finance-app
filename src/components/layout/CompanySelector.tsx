import { Loading } from '@/components/Loading';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { cn } from '@/lib/utils';
import { companyService } from '@/services/company';
import { useAuthStore } from '@/stores/auth';
import { Company } from '@/types/company';
import { formatCNPJ } from '@/utils/formatCNPJ';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CompanySelector = () => {
  const { user } = useAuthStore();
  const { activeCompany, changeActiveCompany } = useActiveCompany();

  const {
    data: companies,
    isLoading,
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
      <SelectTrigger className="min-w-[220px] h-12 px-4 bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md flex items-center justify-between shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors gap-2">
        <div className="flex flex-col items-start flex-1">
          <span className="font-bold text-text dark:text-text-dark leading-tight">
            {activeCompany?.name || 'Selecione uma empresa'}
          </span>
          {activeCompany?.cnpj && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatCNPJ(activeCompany.cnpj)}
            </span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md shadow-lg p-1">
        {companies.map((company: Company) => (
          <SelectItem
            key={company.id}
            value={company.id}
            className={cn(
              'flex flex-row items-center px-4 py-2 rounded gap-x-3 mb-1',
              'hover:bg-primary-50 dark:hover:bg-primary-900',
              'focus:bg-primary-100 dark:focus:bg-primary-900',
              'data-[state=checked]:bg-primary-600 data-[state=checked]:text-white',
            )}
          >
            <span className="min-w-[24px] flex justify-center items-center"></span>
            <div className="flex flex-col flex-1">
              <span className="font-medium leading-tight">{company.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatCNPJ(company.cnpj)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
