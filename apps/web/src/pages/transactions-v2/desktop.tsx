import { useMemo } from 'react';

import { DetailSkeleton } from '@/components/skeletons';
import { ViewDefault } from '@/layouts/ViewDefault';

import { TimelineDesktopHeader } from './components/TimelineDesktopHeader';
import { TimelinePanel } from './components/TimelinePanel';
import { TimelinePeriodSummary } from './components/TimelinePeriodSummary';
import { TransactionsV2Modals } from './components/TransactionsV2Modals';
import { useTransactionsV2Controller } from './hooks/useTransactionsV2Controller';
import { resolvePeriodEndBalance } from './utils/buildDayNarrative';

export function TransactionsV2PageDesktop() {
  const controller = useTransactionsV2Controller();

  const currentBalance = useMemo(
    () => resolvePeriodEndBalance(controller.periodTransactions),
    [controller.periodTransactions],
  );

  if (controller.isLoading && controller.filteredTransactions.length === 0) {
    return (
      <ViewDefault>
        <div className="px-4 py-10">
          <DetailSkeleton title="Linha do tempo" />
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="-m-4 flex min-h-[calc(100dvh-5rem)] flex-col sm:-m-6 lg:-m-6">
        <TimelineDesktopHeader
          startDate={controller.startDate}
          setStartDate={controller.setStartDate}
          endDate={controller.endDate}
          setEndDate={controller.setEndDate}
          currentBalance={currentBalance}
          onPreviousPeriod={controller.handlePreviousPeriod}
          onNextPeriod={controller.handleNextPeriod}
          onNewTransaction={() => controller.setShowCreateModal(true)}
        />

        <TimelinePeriodSummary
          totalDebits={controller.totals.totalDebits}
          totalCredits={controller.totals.totalCredits}
          movementCount={controller.movementCount}
          periodBalance={controller.totals.finalBalance}
        />

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3 lg:px-6">
          <TimelinePanel
            className="min-h-0 flex-1"
            showPeriodNav={false}
            showPeriodTrigger={false}
            showPeriodBalance={false}
            startDate={controller.startDate}
            setStartDate={controller.setStartDate}
            endDate={controller.endDate}
            setEndDate={controller.setEndDate}
            selectedAccountId={controller.selectedAccountId}
            setSelectedAccountId={controller.setSelectedAccountId}
            selectedType={controller.selectedType}
            setSelectedType={controller.setSelectedType}
            selectedCategoryName={controller.selectedCategoryName}
            setSelectedCategoryName={controller.setSelectedCategoryName}
            selectedValueRange={controller.selectedValueRange}
            setSelectedValueRange={controller.setSelectedValueRange}
            activeFilterCount={controller.activeFilterCount}
            onClearFilters={controller.clearFilters}
            accounts={controller.accounts}
            categories={controller.categories}
            searchTerm={controller.searchTerm}
            setSearchTerm={controller.setSearchTerm}
            visibleItems={controller.visibleTransactions}
            allTransactions={controller.filteredTransactions}
            filteredCount={controller.movementCount}
            periodBalance={controller.totals.finalBalance}
            isLoading={controller.isLoading || controller.isFetching}
            hasMore={controller.hasMore}
            onLoadMore={controller.loadMore}
            onPreviousPeriod={controller.handlePreviousPeriod}
            onNextPeriod={controller.handleNextPeriod}
            showActions
            onEdit={controller.handleEdit}
            onDelete={controller.handleDelete}
            onViewHistory={controller.handleViewHistory}
            onRetryPayment={controller.handleRetryPayment}
          />
        </div>
      </div>

      <TransactionsV2Modals controller={controller} />
    </ViewDefault>
  );
}
