import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { Loading } from '@/components/Loading';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuth } from '@/hooks/useAuth';
import { usePlanPermissions } from '@/hooks/usePlanPermissions';
import { companyService } from '@/services/companyService';
import { Company } from '@/types/company';
import { maskDocument } from '@/utils/formatDocument';

import { shouldShowCompanySelector } from './shouldShowCompanySelector';

interface CompanySelectorProps {
  readonly size?: 'default' | 'compact' | 'large';
}

export const CompanySelector = ({ size = 'default' }: CompanySelectorProps = {}) => {
  const { user, isLoadingUser } = useAuth();
  const { activeCompany, changeActiveCompany } = useActiveCompany();
  const { canCreateMultipleCompanies, isLoading: isLoadingPermissions } = usePlanPermissions();

  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => companyService.getUserCompanies(),
    enabled: !!user && !isLoadingUser,
  });

  const companyOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      (companies ?? []).map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companies],
  );

  const companyCount = companies?.length ?? 0;
  const showSelector = shouldShowCompanySelector({
    companyCount,
    canCreateMultipleCompanies,
  });

  if (!user) {
    return null;
  }

  if (isLoadingCompanies || (isLoadingPermissions && companyCount <= 1)) {
    return <Loading size="small" />;
  }

  if (!showSelector) {
    return null;
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
    changeActiveCompany(selectedCompany ?? null);
  };

  const renderCompanyItem = (option: ComboBoxOption<string>) => {
    const company = companies.find((c) => c.id === option.value);
    if (!company) {
      return <span>{option.label}</span>;
    }

    return (
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium leading-tight">{company.name}</span>
        <span className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
          {maskDocument(company.cnpj)}
        </span>
      </div>
    );
  };

  const renderCompanyTrigger = (
    option: ComboBoxOption<string> | undefined,
    displayValue: string,
  ) => {
    if (!option) {
      return (
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center pl-1">
          <span className="text-xs font-bold uppercase leading-tight text-text dark:text-text-dark">
            {displayValue}
          </span>
        </div>
      );
    }

    const company = companies.find((c) => c.id === option.value);
    if (!company) {
      return (
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center pl-1">
          <span className="text-xs font-bold uppercase leading-tight text-text dark:text-text-dark">
            {displayValue}
          </span>
        </div>
      );
    }

    return (
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center pl-1">
        <span className="text-xs font-bold uppercase leading-tight text-text dark:text-text-dark">
          {company.name}
        </span>
        <span className="mt-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
          {maskDocument(company.cnpj)}
        </span>
      </div>
    );
  };

  let heightClass = 'h-[52px]';
  if (size === 'compact') {
    heightClass = 'h-[44px]';
  } else if (size === 'large') {
    heightClass = 'h-[56px]';
  }

  let paddingClass = 'px-4 py-2';
  if (size === 'compact') {
    paddingClass = 'px-3 py-1.5';
  } else if (size === 'large') {
    paddingClass = 'px-4 py-3';
  }

  return (
    <div className="flex w-full min-w-0 items-center justify-start">
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
        showClearButton={false}
        className={`${heightClass} w-full ${paddingClass} bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md shadow-sm flex items-center justify-start`}
        contentClassName="rounded-md shadow-lg w-full"
      />
    </div>
  );
};
