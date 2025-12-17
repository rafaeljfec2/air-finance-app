import { BalanceChart } from '@/components/charts/BalanceChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardBalanceHistory } from '@/hooks/useDashboard';
import type { DashboardFilters } from '@/types/dashboard';

interface BalanceEvolutionCardProps {
  companyId: string;
  filters: DashboardFilters;
  onOpenDetails?: () => void;
}

export function BalanceEvolutionCard({
  companyId,
  filters,
  onOpenDetails,
}: Readonly<BalanceEvolutionCardProps>) {
  const { data, isLoading, error } = useDashboardBalanceHistory(companyId, filters);

  return (
    <Card className="border-border dark:border-border-dark">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text dark:text-text-dark">Evolução do Saldo</h3>
          {onOpenDetails && (
            <Button variant="outline" size="sm" onClick={onOpenDetails}>
              Ver detalhes
            </Button>
          )}
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          {isLoading && <Spinner size="lg" className="text-emerald-500" />}
          {!isLoading && error && (
            <p className="text-sm text-red-500">Erro ao carregar evolução do saldo.</p>
          )}
          {!isLoading && !error && data && data.length > 0 && <BalanceChart data={data} />}
          {!isLoading && !error && (!data || data.length === 0) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum movimento financeiro no período selecionado.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
