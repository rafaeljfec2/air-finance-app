import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import { Loading } from '@/components/Loading';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ViewDefault } from '@/layouts/ViewDefault';
import type { OpenBankingEntitlement } from '@/services/subscriptionService';
import { openBankingService } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { useCompanyStore } from '@/stores/company';
import { UserRole } from '@/types/user';

import { AccountCardsContainerDesktop } from './components/AccountCardsContainerDesktop';
import { AccountErrorState } from './components/AccountErrorState';
import { AccountModals } from './components/AccountModals';
import { AccountSummary } from './components/AccountSummary';
import { NoAccountsState } from './components/NoAccountsState';
import { StatementCard } from './components/StatementCard';
import { createInitialSummary } from './hooks/types';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useAccountManagement } from './hooks/useAccountManagement';
import { useStatementNavigation } from './hooks/useStatementNavigation';

function SlotBanner({ entitlement }: Readonly<{ entitlement: OpenBankingEntitlement }>) {
  const available = entitlement.entitledSlots - entitlement.usedSlots;
  const isFull = available <= 0;
  const isOver = entitlement.usedSlots > entitlement.entitledSlots;
  const pct =
    entitlement.entitledSlots > 0
      ? Math.min((entitlement.usedSlots / entitlement.entitledSlots) * 100, 100)
      : 0;

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border text-sm ${
        isOver
          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50'
          : isFull
            ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'
            : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`font-semibold ${
              isOver
                ? 'text-red-700 dark:text-red-400'
                : isFull
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
            }`}
          >
            Open Finance — {entitlement.usedSlots}/{entitlement.entitledSlots} contas
          </span>
          {isOver && (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Limite excedido
            </span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isOver ? 'bg-red-500' : isFull ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AccountDetailsPageDesktop() {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const user = useAuthStore((state) => state.user);
  const isGod = user?.role === UserRole.GOD;

  const { data: entitlement } = useQuery({
    queryKey: ['open-banking-entitlement', companyId],
    queryFn: () => openBankingService.getEntitlement(companyId),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const showBadge = entitlement && (entitlement.entitledSlots > 0 || isGod);
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

        {showBadge && (
          <div className="px-4 pt-3 pb-1 lg:px-6">
            <SlotBanner entitlement={entitlement} />
          </div>
        )}

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
