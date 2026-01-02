import { Loading } from '@/components/Loading';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuth } from '@/hooks/useAuth';
import { companyService } from '@/services/companyService';
import { Company } from '@/types/company';
import { formatDocument } from '@/utils/formatDocument';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const CompanySelector = () => {
  const { user, isLoadingUser } = useAuth();
  const { activeCompany, changeActiveCompany } = useActiveCompany();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => companyService.getUserCompanies(),
    enabled: !!user && !isLoadingUser,
  });

  // Convert companies to ComboBox options (must be before early returns)
  const companyOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      (companies ?? []).map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companies],
  );

  if (!user) return null;

  // Ocultar seletor no plano Free (apenas uma empresa permitida)
  if (user.plan === 'free') {
    return null;
  }

  if (isLoading) {
    return <Loading size="small" />;
  }

  // Mostrar seletor para planos Pro e Business quando houver empresas
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

  // Custom render for company items (name + CNPJ/CPF in two lines)
  const renderCompanyItem = (option: ComboBoxOption<string>) => {
    const company = companies.find((c) => c.id === option.value);
    if (!company) return <span>{option.label}</span>;

    return (
      <div className="flex flex-col">
        <span className="font-medium leading-tight text-sm">{company.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatDocument(company.cnpj)}
        </span>
      </div>
    );
  };

  // Custom render for trigger (name + CNPJ/CPF in two lines)
  const renderCompanyTrigger = (
    option: ComboBoxOption<string> | undefined,
    displayValue: string,
  ) => {
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
          {formatDocument(company.cnpj)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-w-[242px]">
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
        className="h-[52px] px-4 bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md shadow-sm"
        contentClassName="rounded-md shadow-lg"
      />
    </div>
  );
};
