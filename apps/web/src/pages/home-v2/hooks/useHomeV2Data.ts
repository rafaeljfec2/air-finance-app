import { useQuery } from '@tanstack/react-query';

import { useHomePageData } from '@/pages/home/hooks/useHomePageData';
import { getAccountsSummaryFromExtracts } from '@/services/accountService';
import { getCreditCardsSummary } from '@/services/creditCardService';
import { useCompanyStore } from '@/stores/company';

export function useHomeV2Data() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  // Get balance data from transactions (cash flow)
  const { balance, accumulatedBalance, summaryQuery } = useHomePageData();

  // Get accounts summary with calculated balances from extracts
  const accountsSummaryQuery = useQuery({
    queryKey: ['accounts-summary-from-extracts', companyId],
    queryFn: () => getAccountsSummaryFromExtracts(companyId),
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
      summaryQuery.isLoading || accountsSummaryQuery.isLoading || creditCardsSummaryQuery.isLoading,
  };
}
