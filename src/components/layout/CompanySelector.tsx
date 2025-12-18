import { Loading } from '@/components/Loading';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { companyService } from '@/services/company';
import { useAuthStore } from '@/stores/auth';
import { Company } from '@/types/company';
import { formatCNPJ } from '@/utils/formatCNPJ';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

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

  const handleCompanyChange = (companyId: string | null) => {
    if (!companyId) {
      changeActiveCompany(null);
      return;
    }
    const selectedCompany = companies.find((company: Company) => company.id === companyId);
    changeActiveCompany(selectedCompany || null);
  };

  // Convert companies to ComboBox options
  const companyOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      companies.map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companies],
  );

  // Custom render for company items (name + CNPJ in two lines)
  const renderCompanyItem = (option: ComboBoxOption<string>) => {
    const company = companies.find((c) => c.id === option.value);
    if (!company) return <span>{option.label}</span>;

    return (
      <div className="flex flex-col">
        <span className="font-medium leading-tight text-sm">{company.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatCNPJ(company.cnpj)}
        </span>
      </div>
    );
  };

  // Custom render for trigger (name + CNPJ in two lines)
  const renderCompanyTrigger = (option: ComboBoxOption<string> | undefined, displayValue: string) => {
    if (!option) {
      return (
        <div className="flex flex-col items-start flex-1">
          <span className="font-bold text-text dark:text-text-dark leading-tight text-sm">
            {displayValue}
          </span>
        </div>
      );
    }

    const company = companies.find((c) => c.id === option.value);
    if (!company) {
      return (
        <div className="flex flex-col items-start flex-1">
          <span className="font-bold text-text dark:text-text-dark leading-tight text-sm">
            {displayValue}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start flex-1">
        <span className="font-bold text-text dark:text-text-dark leading-tight text-sm">
          {company.name}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatCNPJ(company.cnpj)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-w-[220px]">
      <ComboBox
        options={companyOptions}
        value={activeCompany?.id || null}
        onValueChange={handleCompanyChange}
        placeholder="Selecione uma empresa"
        searchable
        searchPlaceholder="Buscar empresa..."
        renderItem={renderCompanyItem}
        renderTrigger={renderCompanyTrigger}
        maxHeight="max-h-56"
        className="h-12 px-4 bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md shadow-sm"
        contentClassName="rounded-md shadow-lg"
      />
    </div>
  );
};
