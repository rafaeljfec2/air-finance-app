import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { AccountHeader } from './components/AccountHeader';
import { AccountSummary } from './components/AccountSummary';
import { StatementCard } from './components/StatementCard';
import { AccountErrorState } from './components/AccountErrorState';
import { createInitialSummary } from './hooks/types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function AccountDetailsPageDesktop() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accountId ?? '');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;
  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useStatementNavigation();

  const {
    account,
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

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const isSearching = searchInput !== debouncedSearch;

  useEffect(() => {
    if (accountId) {
      setSelectedAccountId(accountId);
    }
  }, [accountId]);

  const handleAccountSelect = (newAccountId: string) => {
    if (newAccountId !== selectedAccountId) {
      setSelectedAccountId(newAccountId);
      navigate(`/accounts/${newAccountId}/details`, { replace: true });
    }
  };

  const handleBack = () => navigate('/accounts');

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center min-h-[60vh] bg-background dark:bg-background-dark">
          <Loading size="large">Carregando extrato, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
          <AccountHeader
            account={account}
            accounts={accounts}
            onBack={handleBack}
            onAccountSelect={handleAccountSelect}
            selectedAccountId={selectedAccountId}
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
        <AccountHeader
          account={account}
          accounts={accounts}
          onBack={handleBack}
          onAccountSelect={handleAccountSelect}
          selectedAccountId={selectedAccountId}
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
    </ViewDefault>
  );
}

export default AccountDetailsPageDesktop;
