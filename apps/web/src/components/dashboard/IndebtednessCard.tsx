import { AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useIndebtedness } from '@/hooks/useIndebtedness';

import { generateSuggestions } from './indebtednessCard.utils';
import {
  AccountBalancesSection,
  CreditUtilizationSection,
  DebtSummarySection,
  LiquiditySection,
  SuggestionsSection,
} from './IndebtednessCardSections';

interface IndebtednessCardProps {
  companyId: string;
}

export function IndebtednessCard({ companyId }: Readonly<IndebtednessCardProps>) {
  const { data, isLoading, error } = useIndebtedness(companyId);

  const suggestions = useMemo(() => (data ? generateSuggestions(data) : []), [data]);

  if (!companyId) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <div className="p-4">
          <div className="flex items-center justify-center h-24">
            <Spinner size="lg" className="text-primary-500" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Erro ao carregar métricas de endividamento.</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="bg-white dark:bg-card-dark border-none shadow-md overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            Análise de Saúde Financeira
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-100 dark:border-border-dark">
            <CreditUtilizationSection data={data.creditUtilization} />
          </div>
          <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-100 dark:border-border-dark">
            <LiquiditySection data={data.liquidity} />
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark rounded-xl border border-gray-100 dark:border-border-dark p-1">
          <DebtSummarySection totalDebt={data.totalDebt} debtToRevenue={data.debtToRevenue} />
        </div>

        <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-100 dark:border-border-dark">
          <AccountBalancesSection balances={data.accountBalances} />
        </div>

        {suggestions.length > 0 && <SuggestionsSection suggestions={suggestions} />}
      </div>
    </Card>
  );
}
