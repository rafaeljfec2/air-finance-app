import { PieChart } from '@/components/charts/PieChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardExpensesByCategory } from '@/hooks/useDashboard';
import type { DashboardFilters, ExpenseByCategory } from '@/types/dashboard';

interface ExpensesDistributionCardProps {
  companyId: string;
  filters: DashboardFilters;
  onOpenCategories?: () => void;
}

export function ExpensesDistributionCard({
  companyId,
  filters,
  onOpenCategories,
}: Readonly<ExpensesDistributionCardProps>) {
  const { data, isLoading, error } = useDashboardExpensesByCategory(companyId, filters);

  const chartData = (data ?? []).map((item: ExpenseByCategory) => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <Card className="border-border dark:border-border-dark">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text dark:text-text-dark">
            Distribuição de Despesas
          </h3>
          {onOpenCategories && (
            <Button variant="outline" size="sm" onClick={onOpenCategories}>
              Ver categorias
            </Button>
          )}
        </div>
        <div className="h-56 w-full flex items-center justify-center">
          {isLoading && <Spinner size="lg" className="text-rose-500" />}
          {!isLoading && error && (
            <p className="text-sm text-red-500">Erro ao carregar distribuição de despesas.</p>
          )}
          {!isLoading && !error && chartData.length > 0 && <PieChart data={chartData} />}
          {!isLoading && !error && chartData.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma despesa encontrada no período selecionado.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
