import { ViewDefault } from '@/layouts/ViewDefault';
import { usePreferencesStore } from '@/stores/preferences';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { HomeHeader } from './components/HomeHeader';
import { CashComposition } from './components/CashComposition';
import { MonthlySummaryBar } from './components/MonthlySummaryBar';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { RecentTransactionsList } from './components/RecentTransactionsList';
import { createQuickActions } from './constants/quickActions';
import { useHomePageData } from './hooks/useHomePageData';
import { useAccounts } from '@/hooks/useAccounts';

export function HomePage() {
  const { isPrivacyModeEnabled, togglePrivacyMode } = usePreferencesStore();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const navigate = useNavigate();
  const { accounts } = useAccounts();

  const {
    balance,
    accumulatedBalance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    expensesCoverageRatio,
    total,
    cashComposition,
    cashInsight,
    transactions,
    summaryQuery,
  } = useHomePageData();

  const handleCreditCardClick = () => {
    navigate('/credit-cards/bills');
  };

  const handleAccountsClick = () => {
    const bankAccounts = accounts?.filter((acc) => acc.type !== 'credit_card') ?? [];
    if (bankAccounts.length > 0) {
      navigate('/accounts/details');
    } else {
      navigate('/accounts');
    }
  };

  const quickActions = createQuickActions(
    () => setIsTypeModalOpen(true),
    handleCreditCardClick,
    handleAccountsClick,
  );

  return (
    <ViewDefault>
      <div className="flex flex-col min-h-[calc(100vh-6rem)] max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {/* Header Section */}
        <header className="bg-white dark:bg-card-dark px-6 pt-6 md:pt-4 pb-4 rounded-b-[2rem] md:rounded-2xl shadow-sm relative z-10 md:col-span-full">
          <HomeHeader
            balance={balance}
            accumulatedBalance={accumulatedBalance}
            cashInsight={cashInsight}
            isPrivacyModeEnabled={isPrivacyModeEnabled}
            onTogglePrivacyMode={togglePrivacyMode}
          />

          <CashComposition
            composition={cashComposition}
            isPrivacyModeEnabled={isPrivacyModeEnabled}
          />

          <div className="mt-3">
            <MonthlySummaryBar
              income={income}
              expenses={expenses}
              incomePercentage={incomePercentage}
              expensesPercentage={expensesPercentage}
              expensesCoverageRatio={expensesCoverageRatio}
              total={total}
              isLoading={summaryQuery.isLoading}
              isPrivacyModeEnabled={isPrivacyModeEnabled}
            />
          </div>
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
