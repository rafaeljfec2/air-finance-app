import { ViewDefault } from '@/layouts/ViewDefault';
import { usePreferencesStore } from '@/stores/preferences';
import { BalanceSection } from './components/BalanceSection';
import { BankAccountsSection } from './components/BankAccountsSection';
import { CreditCardsSection } from './components/CreditCardsSection';
import { useHomeV2Data } from './hooks/useHomeV2Data';
import { Spinner } from '@/components/ui/spinner';

export function HomePageV2() {
  const { isPrivacyModeEnabled, togglePrivacyMode } = usePreferencesStore();

  const {
    balance,
    accumulatedBalance,
    bankAccounts,
    totalBankBalance,
    creditCards,
    creditCardAggregated,
    isLoading,
  } = useHomeV2Data();

  return (
    <ViewDefault>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Spinner size="lg" className="text-primary-500" />
          </div>
        ) : (
          <>
            {/* Balance Section */}
            <BalanceSection
              balance={balance}
              accumulatedBalance={accumulatedBalance}
              isPrivacyModeEnabled={isPrivacyModeEnabled}
              onTogglePrivacyMode={togglePrivacyMode}
            />

            {/* Bank Accounts Section */}
            <BankAccountsSection
              accounts={bankAccounts}
              totalBalance={totalBankBalance}
              isPrivacyModeEnabled={isPrivacyModeEnabled}
            />

            {/* Credit Cards Section */}
            <CreditCardsSection
              creditCards={creditCards}
              aggregated={creditCardAggregated}
              isPrivacyModeEnabled={isPrivacyModeEnabled}
            />
          </>
        )}
      </div>
    </ViewDefault>
  );
}
