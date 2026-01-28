import { ViewDefault } from '@/layouts/ViewDefault';
import { usePreferencesStore } from '@/stores/preferences';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { HomeHeader } from './components/HomeHeader';
import { MonthlySummaryBar } from './components/MonthlySummaryBar';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { RecentTransactionsList } from './components/RecentTransactionsList';
import { createQuickActions } from './constants/quickActions';
import { useHomePageData } from './hooks/useHomePageData';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useAccounts } from '@/hooks/useAccounts';
import { useCompanyStore } from '@/stores/company';

export function HomePage() {
  const { isPrivacyModeEnabled, togglePrivacyMode } = usePreferencesStore();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { creditCards } = useCreditCards(companyId);
  const { accounts } = useAccounts();

  const {
    balance,
    accumulatedBalance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    total,
    transactions,
    summaryQuery,
  } = useHomePageData();

  const handleCreditCardClick = () => {
    if (creditCards && creditCards.length > 0) {
      navigate(`/credit-cards/${creditCards[0].id}/bills`);
    } else {
      navigate('/credit-cards');
    }
  };

  const handleAccountsClick = () => {
    const bankAccounts = accounts?.filter((acc) => acc.type !== 'credit_card') ?? [];
    if (bankAccounts.length > 0) {
      navigate(`/accounts/${bankAccounts[0].id}/details`);
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
