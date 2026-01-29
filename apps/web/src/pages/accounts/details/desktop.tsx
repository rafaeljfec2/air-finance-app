import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { useAccountManagement } from './hooks/useAccountManagement';
import { AccountCardsContainerDesktop } from './components/AccountCardsContainerDesktop';
import { AccountSummary } from './components/AccountSummary';
import { StatementCard } from './components/StatementCard';
import { AccountErrorState } from './components/AccountErrorState';
import { AccountModals } from './components/AccountModals';
import { createInitialSummary } from './hooks/types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function AccountDetailsPageDesktop() {
  const navigate = useNavigate();
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;
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

  const handleAccountSelect = useCallback(
    (newAccountId: string) => {
      if (newAccountId !== selectedAccountId) {
        setSelectedAccountId(newAccountId);
      }
    },
    [selectedAccountId],
  );

  const { formModal, scheduleModal, deleteModal, handlers } = useAccountManagement({
    accounts,
    selectedAccountId,
    onSelectAccount: setSelectedAccountId,
  });

  useEffect(() => {
    if (isLoading) return;

    if (accounts.length === 0) {
      navigate('/accounts', { replace: true });
      return;
    }

    if (!selectedAccountId || !accounts.some((acc) => acc.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, isLoading, navigate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const isSearching = searchInput !== debouncedSearch;

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
        scheduleModal={scheduleModal}
        deleteModal={deleteModal}
      />
    </ViewDefault>
  );
}

export default AccountDetailsPageDesktop;
