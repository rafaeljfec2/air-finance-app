import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { Modal } from '@/components/ui/Modal';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuth } from '@/hooks/useAuth';
import { companyService } from '@/services/companyService';
import { formatDocument } from '@/utils/formatDocument';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState, useRef } from 'react';

import { useLocation } from 'react-router-dom';

export function CompanySelectionModal() {
  const { user, isLoadingUser } = useAuth();
  const { activeCompany, changeActiveCompany, clearActiveCompany } = useActiveCompany();
  const location = useLocation();
  const hasBeenShownRef = useRef(false);
  const hasConfirmedSelectionRef = useRef(false);

  const {
    data: companies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => companyService.getUserCompanies(),
    enabled: !!user && !isLoadingUser,
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const hasCompanies = Array.isArray(companies) && companies.length > 0;

  // Memoize first company ID to avoid unnecessary re-renders
  const firstCompanyId = useMemo(() => {
    return hasCompanies && companies[0]?.id ? companies[0].id : null;
  }, [hasCompanies, companies]);

  const hasValidActiveCompany = !!activeCompany?.id;
  const isSubscriptionPage =
    location.pathname.startsWith('/pricing') ||
    location.pathname.startsWith('/settings/subscription');

  // Reset flags when user logs out
  useEffect(() => {
    if (!user) {
      hasBeenShownRef.current = false;
      hasConfirmedSelectionRef.current = false;
    }
  }, [user]);

  const shouldShowModal =
    !isSubscriptionPage &&
    !!user &&
    !isLoadingUser &&
    !isLoading &&
    !hasValidActiveCompany &&
    hasCompanies &&
    !hasBeenShownRef.current &&
    !hasConfirmedSelectionRef.current;

  // Set selected company ID when companies load or activeCompany changes
  useEffect(() => {
    if (!user || isLoading || isLoadingUser) {
      return;
    }

    if (activeCompany?.id) {
      setSelectedCompanyId(activeCompany.id);
      return;
    }

    // Set first company as selected (for display in modal)
    if (firstCompanyId && !activeCompany?.id) {
      setSelectedCompanyId(firstCompanyId);
    }
  }, [user, isLoading, isLoadingUser, activeCompany?.id, firstCompanyId]);

  useEffect(() => {
    if (!user || isLoading || isLoadingUser || !hasCompanies) {
      return;
    }

    if (activeCompany?.id) {
      return;
    }

    if (hasBeenShownRef.current || hasConfirmedSelectionRef.current) {
      return;
    }

    if (companies.length === 1 && firstCompanyId) {
      const singleCompany = companies[0];
      if (singleCompany?.id) {
        hasConfirmedSelectionRef.current = true;
        changeActiveCompany(singleCompany);
      }
    }
  }, [
    user,
    isLoading,
    isLoadingUser,
    hasCompanies,
    companies,
    activeCompany?.id,
    firstCompanyId,
    changeActiveCompany,
  ]);

  useEffect(() => {
    if (!user) {
      setSelectedCompanyId('');
      clearActiveCompany();
    }
  }, [user, clearActiveCompany]);

  const handleConfirmSelection = () => {
    if (!selectedCompanyId) return;
    if (!Array.isArray(companies) || companies.length === 0) return;
    const selectedCompany = companies.find((company) => company?.id === selectedCompanyId);
    if (!selectedCompany) return;
    hasConfirmedSelectionRef.current = true;
    changeActiveCompany(selectedCompany);
  };

  const modalTitle = useMemo(() => {
    if (isLoading) return 'Carregando empresas';
    if (!hasCompanies) return 'Nenhuma empresa encontrada';
    return 'Selecione uma empresa';
  }, [isLoading, hasCompanies]);

  // Convert companies to ComboBox options
  const companyOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      Array.isArray(companies)
        ? companies.map((company) => ({
            value: company.id,
            label: company.name || 'Sem nome',
          }))
        : [],
    [companies],
  );

  // Format selected value to show name and CNPJ/CPF
  const formatSelectedCompany = (option: ComboBoxOption<string> | undefined) => {
    if (!option) return 'Selecione uma empresa';
    const company = Array.isArray(companies) ? companies.find((c) => c.id === option.value) : null;
    if (!company) return option.label;
    return `${company.name || 'Sem nome'} - ${formatDocument(company.cnpj || '')}`;
  };

  // Custom render for company items (name + CNPJ/CPF in two lines)
  const renderCompanyItem = (option: ComboBoxOption<string>) => {
    const company = Array.isArray(companies) ? companies.find((c) => c.id === option.value) : null;
    if (!company) return <span className="text-gray-900 dark:text-gray-100">{option.label}</span>;

    return (
      <div className="flex flex-col">
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {company.name || 'Sem nome'}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {formatDocument(company.cnpj || '')}
        </span>
      </div>
    );
  };

  return (
    <Modal
      open={shouldShowModal}
      onClose={() => {}}
      dismissible={false}
      title={modalTitle}
      className="max-w-lg p-4 sm:p-6 md:p-8"
    >
      <div className="space-y-4 sm:space-y-6">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Escolha a empresa que deseja gerenciar. Essa definição pode ser alterada depois no seletor
          do cabeçalho.
        </p>

        {isLoading && (
          <div className="flex min-h-[140px] sm:min-h-[180px] flex-col items-center justify-center gap-3 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 py-4 sm:py-6">
            <Loading size="large" />
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center px-2">
              Carregando empresas vinculadas ao seu usuário...
            </p>
          </div>
        )}

        {!isLoading && isError && (
          <div className="rounded-lg bg-red-500/10 dark:bg-red-500/20 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 dark:text-red-400">
            Não foi possível carregar as empresas. Tente novamente em instantes.
          </div>
        )}

        {!isLoading && !isError && !hasCompanies && (
          <div className="rounded-lg bg-gray-100/50 dark:bg-gray-800/50 px-3 sm:px-4 py-4 sm:py-5 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Nenhuma empresa está vinculada à sua conta. Solicite o cadastro de uma empresa para
            continuar utilizando a plataforma.
          </div>
        )}

        {!isLoading && !isError && hasCompanies && (
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <ComboBox
                label="Empresa"
                options={companyOptions}
                value={selectedCompanyId}
                onValueChange={(value) => setSelectedCompanyId(value ?? '')}
                placeholder="Selecione uma empresa"
                searchable
                searchPlaceholder="Buscar empresa..."
                formatSelectedValue={formatSelectedCompany}
                renderItem={renderCompanyItem}
                maxHeight="max-h-56"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Você pode alterar essa seleção a qualquer momento pelo menu superior.
              </p>
            </div>

            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedCompanyId}
              className="w-full h-11 sm:h-12 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Continuar
            </Button>
          </div>
        )}

        {!isLoading && isError && (
          <Button onClick={() => refetch()} className="w-full" variant="default">
            Tentar novamente
          </Button>
        )}
      </div>
    </Modal>
  );
}
