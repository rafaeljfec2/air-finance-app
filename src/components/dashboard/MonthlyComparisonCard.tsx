import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardComparison } from '@/hooks/useDashboard';
import type { DashboardComparison, DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';

interface MonthlyComparisonCardProps {
  companyId: string;
  filters: DashboardFilters;
}

function getChangePct(current: number, previous: number): number {
  if (!previous) return 0;
  return (current / previous - 1) * 100;
}

function formatPctLabel(pct: number): string {
  const rounded = Number.isFinite(pct) ? pct.toFixed(1) : '0.0';
  return `${rounded}% vs mês anterior`;
}

export function MonthlyComparisonCard({
  companyId,
  filters,
}: Readonly<MonthlyComparisonCardProps>) {
  const { data, isLoading, error } = useDashboardComparison(companyId, filters);

  const comparison: DashboardComparison | undefined = data ?? undefined;

  const incomePct = comparison
    ? getChangePct(comparison.current.income, comparison.previous.income)
    : 0;
  const expensesPct = comparison
    ? getChangePct(comparison.current.expenses, comparison.previous.expenses)
    : 0;
  const savingsPct = comparison
    ? getChangePct(comparison.current.savings, comparison.previous.savings)
    : 0;

  return (
    <Card className="border-border dark:border-border-dark">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-text dark:text-text-dark">
            Comparativo Mensal
          </h3>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-24">
            <Spinner size="md" className="text-emerald-500" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-xs text-red-500">Erro ao carregar comparativo mensal.</p>
        )}

        {!isLoading && !error && comparison && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-500">Receitas</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-green-500">
                  {formatCurrency(comparison.current.income)}
                </p>
                <p className="text-[10px] text-gray-500">{formatPctLabel(incomePct)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span className="text-xs text-gray-500">Despesas</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-red-500">
                  {formatCurrency(comparison.current.expenses)}
                </p>
                <p className="text-[10px] text-gray-500">{formatPctLabel(expensesPct)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-500">Economia</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-blue-500">
                  {formatCurrency(comparison.current.savings)}
                </p>
                <p className="text-[10px] text-gray-500">{formatPctLabel(savingsPct)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
