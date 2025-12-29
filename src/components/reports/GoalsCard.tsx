
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DashboardGoalSummary } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { Target } from 'lucide-react';

interface GoalsCardProps {
  goals: DashboardGoalSummary[];
  className?: string;
}

export function GoalsCard({ goals, className }: Readonly<GoalsCardProps>) {
  // Safe default
  const safeGoals = goals || [];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
           <Target className="h-5 w-5 text-primary-500" />
           Metas Financeiras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {safeGoals.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">Nenhuma meta ativa encontrada.</p>
           </div>
        ) : (
          safeGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium truncate max-w-[180px]" title={goal.name}>
                    {goal.name}
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <Progress value={goal.progressPct} className="h-2" />
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                    {goal.progressPct.toFixed(0)}% concluído
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
