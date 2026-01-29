import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loading } from '@/components/Loading';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { AccountCardsContainer } from './components/AccountCardsContainer';
import { AccountStatementHeader } from './components/AccountStatementHeader';
import { AccountSummary } from './components/AccountSummary';
import { StatementTransactionList } from './components/StatementTransactionList';
import { AccountEmptyState } from './components/AccountEmptyState';
import { AccountErrorState } from './components/AccountErrorState';
import { AccountDetailsPageDesktop } from './desktop';
import { createInitialSummary } from './hooks/types';

export function AccountDetailsPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accountId ?? '');
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
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

  useEffect(() => {
    if (accountId) {
      setSelectedAccountId(accountId);
    }
  }, [accountId]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (isDesktop) {
    return <AccountDetailsPageDesktop />;
  }

  const handleAccountSelect = (newAccountId: string) => {
    if (newAccountId !== selectedAccountId) {
      setSelectedAccountId(newAccountId);
      navigate(`/accounts/${newAccountId}/details`, { replace: true });
    }
  };

  const summary = currentStatement?.summary ?? createInitialSummary();

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark pb-20 lg:pb-0">
          <AccountCardsContainer
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          <div className="flex-1 flex items-center justify-center">
            <Loading size="large">Carregando extrato, por favor aguarde...</Loading>
          </div>
        </div>
        <MobileBottomNav
          onNewTransaction={() => setIsFabModalOpen(true)}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          <AccountCardsContainer
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
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
        <MobileBottomNav
          onNewTransaction={() => setIsFabModalOpen(true)}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      </>
    );
  }

  if (!currentStatement && !isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          <AccountCardsContainer
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
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
        <MobileBottomNav
          onNewTransaction={() => setIsFabModalOpen(true)}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      </>
    );
  }

  if (!currentStatement || !account) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
        <AccountCardsContainer
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

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

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <MobileBottomNav
        onNewTransaction={() => setIsFabModalOpen(true)}
        onMenuOpen={() => setIsSidebarOpen(true)}
      />

      <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
    </>
  );
}

export default AccountDetailsPage;
