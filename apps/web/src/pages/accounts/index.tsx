import { Loading } from '@/components/Loading';
import { useAccounts } from '@/hooks/useAccounts';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { companyService } from '@/services/companyService';
import { useAuthStore } from '@/stores/auth';
import { useMemo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountsEmptyState } from './components/AccountsEmptyState';
import { AccountsErrorState } from './components/AccountsErrorState';
import { AccountsFilters } from './components/AccountsFilters';
import { AccountsHeader } from './components/AccountsHeader';
import { AccountsList } from './components/AccountsList';
import { AccountsPageModals } from './components/AccountsPageModals';
import { useAccountFilters } from './hooks/useAccountFilters';
import { useAccountSorting } from './hooks/useAccountSorting';
import { useAccountsPageModals } from './hooks/useAccountsPageModals';
import { UserRole } from '@/types/user';

export function AccountsPage() {
  return <Navigate to="/accounts/details" replace />;
}

export function AccountsManagementPage() {
  const { accounts, isLoading, error, isUpdating, isDeleting } = useAccounts();
  const { activeCompany, setActiveCompany } = useCompanyStore();
  const { canCreateAccount } = usePlanLimits();
  const user = useAuthStore((state) => state.user);
  const isGod = user?.role === UserRole.GOD;

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
    handlers,
  } = useAccountsPageModals();

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
            onConnectOpenFinance={isGod ? handlers.onConnectOpenFinance : undefined}
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
        onConfigureIntegration={handlers.onConfigureIntegration}
        isGod={isGod}
        isPierreAvailable={isPierreAvailable}
        activeCompany={activeCompany}
      />
    </ViewDefault>
  );
}
