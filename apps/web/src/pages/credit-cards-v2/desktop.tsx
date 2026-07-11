import { useMemo } from 'react';

import { DetailSkeleton } from '@/components/skeletons';
import { ViewDefault } from '@/layouts/ViewDefault';

import { EmptyOpenFinanceCards } from './components/EmptyOpenFinanceCards';
import { OfCardsContainer } from './components/OfCardsContainer';
import { OpenFinanceBillsStrip } from './components/OpenFinanceBillsStrip';
import { StatementErrorState } from './components/StatementErrorState';
import { StatementPanel } from './components/StatementPanel';
import { StatementPeriodSummary } from './components/StatementPeriodSummary';
import { useCreditCardsV2Controller } from './hooks/useCreditCardsV2Controller';

export function CreditCardsV2PageDesktop() {
  const {
    cards,
    isLoadingCards,
    cardsError,
    selectedCardId,
    bills,
    isLoadingBills,
    selectedBillId,
    selectedBill,
    selectedBillLabel,
    preset,
    windowOffset,
    fetchPeriod,
    transactions,
    isLoadingStatement,
    statementError,
    refetch,
    handleSelectCard,
    handleSelectBill,
    handlePresetChange,
    handlePreviousPeriod,
    handleNextPeriod,
  } = useCreditCardsV2Controller();

  const periodTotals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    for (const tx of transactions) {
      if (tx.type === 'CREDIT') {
        totalCredit += Math.abs(tx.amount);
      } else {
        totalDebit += Math.abs(tx.amount);
      }
    }
    return { totalDebit, totalCredit, transactionCount: transactions.length };
  }, [transactions]);

  if (isLoadingCards) {
    return (
      <ViewDefault>
        <div className="px-4 py-10">
          <DetailSkeleton title="Cartões" />
        </div>
      </ViewDefault>
    );
  }

  if (cardsError) {
    return (
      <ViewDefault>
        <StatementErrorState error={cardsError} />
      </ViewDefault>
    );
  }

  if (cards.length === 0) {
    return (
      <ViewDefault>
        <EmptyOpenFinanceCards />
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="-m-4 sm:-m-6 lg:-m-6">
        <OfCardsContainer
          creditCards={cards}
          selectedCardId={selectedCardId}
          onCardSelect={handleSelectCard}
        />

        <OpenFinanceBillsStrip
          bills={bills}
          selectedBillId={selectedBillId}
          onSelectBill={handleSelectBill}
          isLoading={isLoadingBills}
        />

        <StatementPeriodSummary
          totalDebit={periodTotals.totalDebit}
          totalCredit={periodTotals.totalCredit}
          transactionCount={periodTotals.transactionCount}
        />

        <div className="px-4 pb-6 lg:px-6">
          {statementError ? (
            <div className="rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark">
              <StatementErrorState error={statementError} onRetry={refetch} />
            </div>
          ) : (
            <StatementPanel
              preset={preset}
              onPresetChange={handlePresetChange}
              startDate={fetchPeriod.startDate}
              endDate={fetchPeriod.endDate}
              onPreviousPeriod={handlePreviousPeriod}
              onNextPeriod={handleNextPeriod}
              canGoNext={windowOffset > 0}
              transactions={transactions}
              isLoading={isLoadingStatement}
              selectedBillLabel={selectedBillLabel}
              selectedBillAmount={selectedBill?.amount ?? null}
              emptyMessage={
                selectedBillId
                  ? 'Nenhum lançamento vinculado a esta fatura no Open Finance.'
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </ViewDefault>
  );
}
