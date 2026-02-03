import { useState, useEffect, useCallback } from 'react';
import { Loading } from '@/components/Loading';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { useResponsiveBreakpoint } from '@/hooks/useResponsiveBreakpoint';
import { useCompanyStore } from '@/stores/company';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { useAccountManagement } from './hooks/useAccountManagement';
import { AccountCardsContainer } from './components/AccountCardsContainer';
import { AccountStatementHeader } from './components/AccountStatementHeader';
import { AccountSummary } from './components/AccountSummary';
import { StatementTransactionList } from './components/StatementTransactionList';
import { AccountEmptyState } from './components/AccountEmptyState';
import { AccountErrorState } from './components/AccountErrorState';
import { AccountModals } from './components/AccountModals';
import { NoAccountsState } from './components/NoAccountsState';
import { AccountDetailsPageDesktop } from './desktop';
import { createInitialSummary } from './hooks/types';

export function AccountDetailsPage() {
  const { isDesktop } = useResponsiveBreakpoint();
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    isInitialLoad,
  } = useAccountDetails(selectedAccountId, currentMonth);

  const hasAccounts = accounts && accounts.length > 0;

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

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
    companyId,
  });

  useEffect(() => {
    if (isLoading || !hasAccounts) return;

    if (!selectedAccountId || !accounts.some((acc) => acc.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, isLoading, hasAccounts]);

  if (isDesktop) {
    return <AccountDetailsPageDesktop />;
  }

  const summary = currentStatement?.summary ?? createInitialSummary();

  const openFabModal = () => setIsFabModalOpen(true);
  const closeFabModal = () => setIsFabModalOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const renderAccountCards = () => (
    <AccountCardsContainer
      accounts={accounts}
      selectedAccountId={selectedAccountId}
      onAccountSelect={handleAccountSelect}
      onMenuClick={openSidebar}
      onEditAccount={handlers.onEditAccount}
      onToggleAutoSync={handlers.onConfigureSchedule}
      onResyncAccount={handlers.onResyncAccount}
      onDeleteAccount={handlers.onDeleteAccount}
      onAddAccount={handlers.onAddAccount}
    />
  );

  const renderMobileNavigation = () => (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <MobileBottomNav onNewTransaction={openFabModal} />
      <TransactionTypeModal isOpen={isFabModalOpen} onClose={closeFabModal} />
      <AccountModals
        formModal={formModal}
        scheduleModal={scheduleModal}
        deleteModal={deleteModal}
      />
    </>
  );

  if (isLoading && !hasAccounts) {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-background dark:bg-background-dark pb-20">
          <Loading size="large">Carregando contas, por favor aguarde...</Loading>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (!hasAccounts) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20">
          <NoAccountsState onAddAccount={handlers.onAddAccount} />
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark pb-20 lg:pb-0">
          {renderAccountCards()}
          <div className="flex-1 flex items-center justify-center">
            <Loading size="large">Carregando extrato, por favor aguarde...</Loading>
          </div>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          {renderAccountCards()}
          <AccountStatementHeader
            month={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark">
            <AccountErrorState error={error} />
          </div>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (!currentStatement && !isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          {renderAccountCards()}
          <AccountStatementHeader
            month={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            summary={summary}
          />
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark flex flex-col">
            <AccountSummary summary={summary} />
            <AccountEmptyState />
          </div>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (!currentStatement || !account) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
        {renderAccountCards()}

        <AccountStatementHeader
          month={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          summary={currentStatement.summary}
        />

        <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark relative flex flex-col">
          {isLoading && !isInitialLoad && (
            <div className="absolute inset-0 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loading size="large">Carregando...</Loading>
            </div>
          )}
          <AccountSummary summary={currentStatement.summary} />

          <div className="flex-1 px-4 pb-4">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
              <StatementTransactionList
                transactions={currentStatement.transactions}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </div>
          </div>
        </div>
      </div>

      {renderMobileNavigation()}
    </>
  );
}

export default AccountDetailsPage;
