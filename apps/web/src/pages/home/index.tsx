import { ViewDefault } from '@/layouts/ViewDefault';
import { usePreferencesStore } from '@/stores/preferences';
import { useState } from 'react';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { HomeHeader } from './components/HomeHeader';
import { MonthlySummaryBar } from './components/MonthlySummaryBar';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { RecentTransactionsList } from './components/RecentTransactionsList';
import { createQuickActions } from './constants/quickActions';
import { useHomePageData } from './hooks/useHomePageData';

export function HomePage() {
  const { isPrivacyModeEnabled, togglePrivacyMode } = usePreferencesStore();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const {
    balance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    total,
    transactions,
    summaryQuery,
  } = useHomePageData();

  const quickActions = createQuickActions(() => setIsTypeModalOpen(true));

  return (
    <ViewDefault>
      <div className="flex flex-col min-h-[calc(100vh-6rem)] pb-20 md:pb-0 max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {/* Header Section */}
        <header className="bg-white dark:bg-card-dark px-6 pt-8 md:pt-6 pb-6 rounded-b-[2rem] md:rounded-2xl shadow-sm relative z-10 md:col-span-full">
          <HomeHeader
            balance={balance}
            isPrivacyModeEnabled={isPrivacyModeEnabled}
            onTogglePrivacyMode={togglePrivacyMode}
          />

          <MonthlySummaryBar
            income={income}
            expenses={expenses}
            incomePercentage={incomePercentage}
            expensesPercentage={expensesPercentage}
            total={total}
            isLoading={summaryQuery.isLoading}
            isPrivacyModeEnabled={isPrivacyModeEnabled}
          />
        </header>

        {/* Quick Actions Grid */}
        <QuickActionsGrid actions={quickActions} />

        {/* Recent Transactions */}
        <RecentTransactionsList transactions={transactions} />
      </div>

      {/* Type Selection Modal */}
      <TransactionTypeModal isOpen={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)} />
    </ViewDefault>
  );
}
