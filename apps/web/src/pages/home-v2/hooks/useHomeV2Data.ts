import { useCompanyStore } from '@/stores/company';
import { useHomePageData } from '@/pages/home/hooks/useHomePageData';
import { useQuery } from '@tanstack/react-query';
import { getAccountsSummary } from '@/services/accountService';
import { getCreditCardsSummary } from '@/services/creditCardService';

export function useHomeV2Data() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  // Get balance data from existing hook
  const { balance, accumulatedBalance, summaryQuery } = useHomePageData();

  // Get accounts summary with calculated balances
  const accountsSummaryQuery = useQuery({
    queryKey: ['accounts-summary', companyId],
    queryFn: () => getAccountsSummary(companyId),
    enabled: !!companyId,
  });

  // Get credit cards summary with usage details and installments
  const creditCardsSummaryQuery = useQuery({
    queryKey: ['credit-cards-summary', companyId],
    queryFn: () => getCreditCardsSummary(companyId),
    enabled: !!companyId,
  });

  const bankAccounts = accountsSummaryQuery.data?.accounts ?? [];
  const totalBankBalance = accountsSummaryQuery.data?.totalBalance ?? 0;

  const creditCards = creditCardsSummaryQuery.data?.creditCards ?? [];
  const creditCardAggregated = creditCardsSummaryQuery.data?.aggregated ?? {
    totalLimit: 0,
    totalUsed: 0,
    totalAvailable: 0,
    totalInstallments: 0,
  };

  return {
    balance,
    accumulatedBalance,
    bankAccounts,
    totalBankBalance,
    creditCards,
    creditCardAggregated,
    isLoading:
      summaryQuery.isLoading ||
      accountsSummaryQuery.isLoading ||
      creditCardsSummaryQuery.isLoading,
  };
}
