import { useState } from 'react';

import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Loading } from '@/components/Loading';
import { DetailSkeleton } from '@/components/skeletons';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';

import { EmptyOpenFinanceCards } from './components/EmptyOpenFinanceCards';
import { OpenFinanceBillsStrip } from './components/OpenFinanceBillsStrip';
import { StatementErrorState } from './components/StatementErrorState';
import { StatementHeader } from './components/StatementHeader';
import { StatementTransactionList } from './components/StatementTransactionList';
import { useCreditCardsV2Controller } from './hooks/useCreditCardsV2Controller';

export function CreditCardsV2PageMobile() {
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    cards,
    isLoadingCards,
    cardsError,
    selectedCard,
    bills,
    isLoadingBills,
    selectedBillId,
    selectedBillLabel,
    preset,
    windowOffset,
    fetchPeriod,
    transactions,
    isLoadingStatement,
    isFetching,
    statementError,
    refetch,
    handleSelectCard,
    handleSelectBill,
    handlePresetChange,
    handlePreviousPeriod,
    handleNextPeriod,
  } = useCreditCardsV2Controller();

  const renderMobileNavigation = () => (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MobileBottomNav onNewTransaction={() => setIsFabModalOpen(true)} />
      <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
    </>
  );

  if (isLoadingCards) {
    return (
      <>
        <div className="flex h-screen flex-col bg-background px-4 py-6 pb-20 dark:bg-background-dark">
          <DetailSkeleton title="Cartões" />
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (cardsError) {
    return (
      <>
        <div className="flex h-screen flex-col overflow-hidden bg-background pb-20 dark:bg-background-dark">
          <StatementErrorState error={cardsError} />
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <div className="flex h-screen flex-col overflow-hidden bg-background pb-20 dark:bg-background-dark">
          <EmptyOpenFinanceCards />
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden bg-background pb-20 dark:bg-background-dark lg:pb-0">
        <StatementHeader
          creditCard={selectedCard}
          creditCards={cards}
          onCardSelect={handleSelectCard}
          onMenuClick={() => setIsSidebarOpen(true)}
          preset={preset}
          onPresetChange={handlePresetChange}
          startDate={fetchPeriod.startDate}
          endDate={fetchPeriod.endDate}
          onPreviousPeriod={handlePreviousPeriod}
          onNextPeriod={handleNextPeriod}
          canGoNext={windowOffset > 0}
          transactionCount={transactions.length}
          selectedBillLabel={selectedBillLabel}
        />

        <div className="relative flex flex-1 flex-col overflow-y-auto bg-background dark:bg-background-dark">
          {isFetching && !isLoadingStatement ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm dark:bg-background-dark/50">
              <Loading size="large">Carregando...</Loading>
            </div>
          ) : null}

          <OpenFinanceBillsStrip
            bills={bills}
            selectedBillId={selectedBillId}
            onSelectBill={handleSelectBill}
            isLoading={isLoadingBills}
          />

          {statementError ? (
            <StatementErrorState error={statementError} onRetry={refetch} />
          ) : isLoadingStatement ? (
            <div className="flex-1 px-4 py-6">
              <DetailSkeleton title="Extrato" />
            </div>
          ) : (
            <div className="flex-1 px-4 pb-4 pt-1">
              <div className="overflow-hidden rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark">
                <StatementTransactionList
                  transactions={transactions}
                  emptyMessage={
                    selectedBillId
                      ? 'Nenhum lançamento vinculado a esta fatura no Open Finance.'
                      : undefined
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {renderMobileNavigation()}
    </>
  );
}
