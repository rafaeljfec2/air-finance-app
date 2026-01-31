import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardComparison } from '@/hooks/useDashboard';
import type { DashboardComparison, DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { useMemo } from 'react';

interface MonthlyComparisonCardProps {
  companyId: string;
  filters: DashboardFilters;
}

function getChangePct(current: number, previous: number): number {
  if (!previous) return 0;
  return (current / previous - 1) * 100;
}

interface ComparisonBarProps {
  readonly label: string;
  readonly current: number;
  readonly previous: number;
  readonly maxValue: number;
  readonly currentColor: string;
  readonly previousColor: string;
}

function ComparisonBar({
  label,
  current,
  previous,
  maxValue,
  currentColor,
  previousColor,
}: ComparisonBarProps) {
  const currentWidth = maxValue > 0 ? (current / maxValue) * 100 : 0;
  const previousWidth = maxValue > 0 ? (previous / maxValue) * 100 : 0;
  const pct = getChangePct(current, previous);
  const pctFormatted = Number.isFinite(pct) ? pct.toFixed(1) : '0.0';
  const isPositive = pct >= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text dark:text-text-dark">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text dark:text-text-dark">
            {formatCurrency(current)}
          </span>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {pctFormatted}%
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 w-12">Atual</span>
          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${currentColor}`}
              style={{ width: `${currentWidth}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 w-12">Anterior</span>
          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${previousColor}`}
              style={{ width: `${previousWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MonthlyComparisonCard({
  companyId,
  filters,
}: Readonly<MonthlyComparisonCardProps>) {
  const { data, isLoading, error } = useDashboardComparison(companyId, filters);

  const comparison: DashboardComparison | undefined = data ?? undefined;

  const maxValue = useMemo(() => {
    if (!comparison) return 0;
    return Math.max(
      comparison.current.income,
      comparison.previous.income,
      comparison.current.expenses,
      comparison.previous.expenses,
      Math.abs(comparison.current.savings),
      Math.abs(comparison.previous.savings),
    );
  }, [comparison]);

  return (
    <Card className="border-border dark:border-border-dark h-full flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-text dark:text-text-dark">
            Comparativo Mensal
          </h3>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center flex-1">
            <Spinner size="md" className="text-emerald-500" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-xs text-red-500">Erro ao carregar comparativo mensal.</p>
        )}

        {!isLoading && !error && comparison && (
          <div className="space-y-4 flex-1">
            <ComparisonBar
              label="Receitas"
              current={comparison.current.income}
              previous={comparison.previous.income}
              maxValue={maxValue}
              currentColor="bg-emerald-500"
              previousColor="bg-emerald-300 dark:bg-emerald-700"
            />

            <ComparisonBar
              label="Despesas"
              current={comparison.current.expenses}
              previous={comparison.previous.expenses}
              maxValue={maxValue}
              currentColor="bg-rose-500"
              previousColor="bg-rose-300 dark:bg-rose-700"
            />

            <ComparisonBar
              label="Economia"
              current={Math.abs(comparison.current.savings)}
              previous={Math.abs(comparison.previous.savings)}
              maxValue={maxValue}
              currentColor="bg-blue-500"
              previousColor="bg-blue-300 dark:bg-blue-700"
            />
          </div>
        )}

        {!isLoading && !error && !comparison && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nenhum dado disponível para comparação.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
