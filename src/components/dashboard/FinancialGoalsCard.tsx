import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardGoalsSummary } from '@/hooks/useDashboard';
import type { DashboardGoalSummary } from '@/types/dashboard';
import { BuildingOfficeIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface FinancialGoalsCardProps {
  companyId: string;
  onViewAll?: () => void;
}

export function FinancialGoalsCard({ companyId, onViewAll }: Readonly<FinancialGoalsCardProps>) {
  const { data, isLoading, error } = useDashboardGoalsSummary(companyId);

  const goals: DashboardGoalSummary[] = data ?? [];

  return (
    <Card className="border-border dark:border-border-dark">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text dark:text-text-dark">Metas Financeiras</h3>
          {onViewAll && (
            <Button variant="outline" size="sm" onClick={onViewAll}>
              Ver todas
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-24">
            <Spinner size="lg" className="text-purple-500" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-500">Erro ao carregar metas financeiras.</p>
        )}

        {!isLoading && !error && goals.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhuma meta financeira cadastrada para esta empresa.
          </p>
        )}

        {!isLoading && !error && goals.length > 0 && (
          <div className="space-y-4">
            {goals.slice(0, 2).map((goal, index) => {
              const Icon = index === 0 ? BuildingOfficeIcon : CreditCardIcon;
              return (
                <div key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`h-5 w-5 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`}
                    />
                    <span className="text-sm">{goal.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{goal.progressPct}%</p>
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${goal.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !error && goals.length > 0 && (
          <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
            O progresso das metas é calculado automaticamente com base nos lançamentos das contas
            vinculadas.
          </p>
        )}
      </div>
    </Card>
  );
}
