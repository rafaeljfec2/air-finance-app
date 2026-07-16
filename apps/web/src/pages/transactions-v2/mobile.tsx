import { useState } from 'react';

import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Loading } from '@/components/Loading';
import { DetailSkeleton } from '@/components/skeletons';

import { TimelineMobileHeader } from './components/TimelineMobileHeader';
import { TimelinePanel } from './components/TimelinePanel';
import { TransactionsV2Modals } from './components/TransactionsV2Modals';
import { useTransactionsV2Controller } from './hooks/useTransactionsV2Controller';

export function TransactionsV2PageMobile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const controller = useTransactionsV2Controller();

  const renderMobileNavigation = () => (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MobileBottomNav onNewTransaction={() => controller.setShowCreateModal(true)} />
    </>
  );

  if (controller.isLoading && controller.filteredTransactions.length === 0) {
    return (
      <>
        <div className="flex h-screen flex-col bg-background px-4 py-6 pb-20 dark:bg-background-dark">
          <DetailSkeleton title="Linha do tempo" />
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden bg-background pb-20 dark:bg-background-dark lg:pb-0">
        <TimelineMobileHeader
          startDate={controller.startDate}
          endDate={controller.endDate}
          movementCount={controller.movementCount}
          onMenuClick={() => setIsSidebarOpen(true)}
          onPreviousPeriod={controller.handlePreviousPeriod}
          onNextPeriod={controller.handleNextPeriod}
        />

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-2">
            <TimelinePanel
              className="min-h-0 flex-1"
              showPeriodNav={false}
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
              isLoading={controller.isLoading}
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

          {controller.isFetching && !controller.isLoading ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/40 pt-16 backdrop-blur-[1px] dark:bg-background-dark/40">
              <Loading size="large">Carregando...</Loading>
            </div>
          ) : null}
        </div>
      </div>

      <TransactionsV2Modals controller={controller} />
      {renderMobileNavigation()}
    </>
  );
}
