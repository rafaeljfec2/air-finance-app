import { useState, useEffect, useCallback } from 'react';
import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { Loading } from '@/components/Loading';
import { useAccounts } from '@/hooks/useAccounts';
import { CreateAccount } from '@/services/accountService';
import { useAccountDetails } from '../details/hooks/useAccountDetails';
import { useStatementNavigation } from '../details/hooks/useStatementNavigation';
import { AccountSummary } from '../details/components/AccountSummary';
import { StatementCard } from '../details/components/StatementCard';
import { AccountErrorState } from '../details/components/AccountErrorState';
import { createInitialSummary } from '../details/hooks/types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { AccountCardsHeader } from './AccountCardsHeader';
import { Banknote } from 'lucide-react';

export function AccountsStatementsSection() {
  const { accounts, isLoading: isLoadingAccounts, createAccount, isCreating } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;

  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useStatementNavigation();

  const {
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
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const handleAddAccount = () => {
    setShowFormModal(true);
  };

  const handleSubmitAccount = (data: CreateAccount) => {
    createAccount(data);
    setShowFormModal(false);
  };

  if (isLoadingAccounts) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loading size="large">Carregando contas...</Loading>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <Banknote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-text dark:text-text-dark mb-2">
            Nenhuma conta cadastrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Cadastre uma conta bancária para ver os extratos.
          </p>
          <button
            onClick={handleAddAccount}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
          >
            Criar primeira conta
          </button>
        </div>

        <AccountFormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSubmitAccount}
          isLoading={isCreating}
        />
      </>
    );
  }

  const summary = currentStatement?.summary ?? createInitialSummary();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <AccountCardsHeader
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={setSelectedAccountId}
          onAddAccount={handleAddAccount}
        />
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loading size="large">Carregando extrato...</Loading>
        </div>

        <AccountFormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSubmitAccount}
          isLoading={isCreating}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <AccountCardsHeader
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={setSelectedAccountId}
          onAddAccount={handleAddAccount}
        />
        <AccountErrorState error={error} />

        <AccountFormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSubmitAccount}
          isLoading={isCreating}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AccountCardsHeader
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
        onAddAccount={handleAddAccount}
      />

      <AccountSummary summary={summary} />

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

      <AccountFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSubmitAccount}
        isLoading={isCreating}
      />
    </div>
  );
}
