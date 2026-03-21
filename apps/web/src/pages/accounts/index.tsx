import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { Loading } from '@/components/Loading';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { companyService } from '@/services/companyService';
import { openBankingService } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { useCompanyStore } from '@/stores/company';
import { UserRole } from '@/types/user';

import { AccountsEmptyState } from './components/AccountsEmptyState';
import { AccountsErrorState } from './components/AccountsErrorState';
import { AccountsFilters } from './components/AccountsFilters';
import { AccountsHeader } from './components/AccountsHeader';
import { AccountsList } from './components/AccountsList';
import { AccountsPageModals } from './components/AccountsPageModals';
import { useAccountFilters } from './hooks/useAccountFilters';
import { useAccountSorting } from './hooks/useAccountSorting';
import { useAccountsPageModals } from './hooks/useAccountsPageModals';

export function AccountsPage() {
  return <Navigate to="/accounts/details" replace />;
}

export function AccountsManagementPage() {
  const { accounts, isLoading, error, isUpdating, isDeleting } = useAccounts();
  const { activeCompany, setActiveCompany } = useCompanyStore();
  const { canCreateAccount } = usePlanLimits();
  const user = useAuthStore((state) => state.user);
  const isGod = user?.role === UserRole.GOD;
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { data: entitlement } = useQuery({
    queryKey: ['open-banking-entitlement', activeCompany?.id],
    queryFn: () => openBankingService.getEntitlement(activeCompany!.id),
    enabled: !!activeCompany?.id,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (searchParams.get('open_banking_success') === 'true') {
      toast.success('Open Banking ativado com sucesso! Agora você pode conectar suas contas.');
      queryClient.invalidateQueries({ queryKey: ['open-banking-entitlement'] });
      setSearchParams({}, { replace: true });
    }
    if (searchParams.get('open_banking_canceled') === 'true') {
      toast.info('Pagamento cancelado. Você pode tentar novamente a qualquer momento.');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  useEffect(() => {
    if (activeCompany?.id && !activeCompany.documentType) {
      companyService
        .getById(activeCompany.id)
        .then((company) => {
          setActiveCompany(company);
        })
        .catch((err) => {
          console.error('Failed to refresh company data:', err);
        });
    }
  }, [activeCompany?.id, activeCompany?.documentType, setActiveCompany]);

  const [viewMode, setViewMode] = useViewMode('accounts-view-mode');

  const { searchTerm, setSearchTerm, filterType, setFilterType, filterAccounts, hasActiveFilters } =
    useAccountFilters();

  const { sortConfig, handleSort, sortAccounts } = useAccountSorting();

  const {
    formModal,
    deleteModal,
    bankingIntegrationModal,
    scheduleModal,
    pierreModal,
    openFinanceModal,
    paywallModal,
    handlers,
  } = useAccountsPageModals({ isGod });

  const filteredAndSortedAccounts = useMemo(() => {
    if (!accounts) return [];
    const filtered = filterAccounts(accounts);
    return sortAccounts(filtered);
  }, [accounts, filterAccounts, sortAccounts]);

  const isPierreAvailable = activeCompany?.documentType === 'CPF';

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Loading size="large">Carregando contas bancárias, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <AccountsErrorState error={error} />;
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
            </p>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <AccountsHeader
            onCreate={handlers.onCreate}
            canCreate={canCreateAccount}
            onConnectPierre={isGod && isPierreAvailable ? handlers.onConnectPierre : undefined}
            onConnectOpenFinance={handlers.onConnectOpenFinance}
            entitlement={entitlement}
            isGod={isGod}
          />

          <AccountsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedAccounts.length === 0 ? (
            <AccountsEmptyState hasFilters={hasActiveFilters} onCreate={handlers.onCreate} />
          ) : (
            <AccountsList
              accounts={filteredAndSortedAccounts}
              viewMode={viewMode}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={handlers.onEdit}
              onDelete={handlers.onDelete}
              onConfigureIntegration={handlers.onConfigureIntegration}
              onConfigureSchedule={handlers.onConfigureSchedule}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>

      <AccountsPageModals
        formModal={formModal}
        deleteModal={deleteModal}
        bankingIntegrationModal={bankingIntegrationModal}
        scheduleModal={scheduleModal}
        pierreModal={pierreModal}
        openFinanceModal={openFinanceModal}
        paywallModal={paywallModal}
        onConfigureIntegration={handlers.onConfigureIntegration}
        isGod={isGod}
        isPierreAvailable={isPierreAvailable}
        activeCompany={activeCompany}
      />
    </ViewDefault>
  );
}
