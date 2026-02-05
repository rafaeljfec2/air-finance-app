import { useState, useEffect, useCallback } from 'react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { useAccountManagement } from './hooks/useAccountManagement';
import { AccountCardsContainerDesktop } from './components/AccountCardsContainerDesktop';
import { AccountSummary } from './components/AccountSummary';
import { StatementCard } from './components/StatementCard';
import { AccountErrorState } from './components/AccountErrorState';
import { AccountModals } from './components/AccountModals';
import { NoAccountsState } from './components/NoAccountsState';
import { createInitialSummary } from './hooks/types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function AccountDetailsPageDesktop() {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useStatementNavigation();

  const {
    accounts,
    currentStatement,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    pagination,
    isFetching,
  } = useAccountDetails(selectedAccountId, currentMonth, searchTermToSend);

  const hasAccounts = accounts && accounts.length > 0;

  const handleAccountSelect = useCallback(
    (newAccountId: string) => {
      if (newAccountId !== selectedAccountId) {
        setSelectedAccountId(newAccountId);
      }
    },
    [selectedAccountId],
  );

  const { formModal, integrationModal, scheduleModal, deleteModal, handlers } =
    useAccountManagement({
      accounts,
      selectedAccountId,
      onSelectAccount: setSelectedAccountId,
      companyId,
    });

  useEffect(() => {
    if (isLoading || !hasAccounts) return;

    if (!selectedAccountId || !accounts.some((acc) => acc.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, isLoading, hasAccounts]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const isSearching = searchInput !== debouncedSearch;

  if (isLoading && !hasAccounts) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="large">Carregando contas, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (!hasAccounts) {
    return (
      <ViewDefault>
        <NoAccountsState onAddAccount={handlers.onAddAccount} />
        <AccountModals
          formModal={formModal}
          onConfigureIntegration={handlers.onConfigureIntegration}
          integrationModal={integrationModal}
          scheduleModal={scheduleModal}
          deleteModal={deleteModal}
        />
      </ViewDefault>
    );
  }

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="-m-4 sm:-m-6 lg:-m-6">
          <AccountCardsContainerDesktop
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onEditAccount={handlers.onEditAccount}
            onToggleAutoSync={handlers.onConfigureSchedule}
            onResyncAccount={handlers.onResyncAccount}
            onDeleteAccount={handlers.onDeleteAccount}
            onAddAccount={handlers.onAddAccount}
          />
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loading size="large">Carregando extrato, por favor aguarde...</Loading>
          </div>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="-m-4 sm:-m-6 lg:-m-6">
          <AccountCardsContainerDesktop
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onEditAccount={handlers.onEditAccount}
            onToggleAutoSync={handlers.onConfigureSchedule}
            onResyncAccount={handlers.onResyncAccount}
            onDeleteAccount={handlers.onDeleteAccount}
            onAddAccount={handlers.onAddAccount}
          />
          <div className="container mx-auto px-4 py-4 lg:px-6">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <AccountErrorState error={error} />
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  const summary = currentStatement?.summary ?? createInitialSummary();

  return (
    <ViewDefault>
      <div className="-m-4 sm:-m-6 lg:-m-6">
        <AccountCardsContainerDesktop
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
          onEditAccount={handlers.onEditAccount}
          onToggleAutoSync={handlers.onConfigureSchedule}
          onResyncAccount={handlers.onResyncAccount}
          onDeleteAccount={handlers.onDeleteAccount}
          onAddAccount={handlers.onAddAccount}
        />

        <AccountSummary summary={summary} />

        <div className="px-4 pb-6 lg:px-6">
          <StatementCard
            month={currentMonth}
            transactions={currentStatement?.transactions ?? []}
            totalTransactions={pagination.total}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            summary={summary}
            searchTerm={searchInput}
            onSearchChange={handleSearchChange}
            isSearching={isSearching || isFetching}
          />
        </div>
      </div>

      <AccountModals
        formModal={formModal}
        onConfigureIntegration={handlers.onConfigureIntegration}
        integrationModal={integrationModal}
        scheduleModal={scheduleModal}
        deleteModal={deleteModal}
      />
    </ViewDefault>
  );
}

export default AccountDetailsPageDesktop;
