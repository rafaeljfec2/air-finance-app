import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useGoals } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';
import { Goal } from '@/services/goalService';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, TrendingUp } from 'lucide-react';

const statusOptions = [
  { value: 'active', label: 'Ativa', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  {
    value: 'completed',
    label: 'Concluída',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  { value: 'cancelled', label: 'Cancelada', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
] as const;

type GoalStatus = (typeof statusOptions)[number]['value'];

function getStatusLabel(status: GoalStatus): string {
  return statusOptions.find((s) => s.value === status)?.label ?? status;
}

function getStatusBadgeColor(status: GoalStatus): string {
  return statusOptions.find((s) => s.value === status)?.color ?? statusOptions[0].color;
}

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  viewMode: 'grid' | 'list';
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
  viewMode,
}: Readonly<GoalCardProps>) {
  const { data: progressData } = useGoals(goal.companyId).getProgress(goal.id);
  const { categories } = useCategories(goal.companyId);
  const { accounts } = useAccounts();
  const category = categories?.find((c) => c.id === goal.categoryId);
  const account = accounts?.find((a) => a.id === goal.accountId);
  const apiProgress = progressData?.progress ?? null;
  const progress =
    apiProgress !== null
      ? apiProgress
      : Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  const daysUntilDeadline = progressData?.daysUntilDeadline ?? 0;

  if (viewMode === 'grid') {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* Header do Card */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2 truncate">
                {goal.name}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  getStatusBadgeColor(goal.status as GoalStatus),
                )}
              >
                {getStatusLabel(goal.status as GoalStatus)}
              </span>
            </div>
            {category && (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: category.color }}
              >
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Descrição */}
          {goal.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
              {goal.description}
            </p>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{progress}% concluído</span>
              <span>
                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
              </span>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-2 mb-4">
            {account && (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Conta vinculada: </span>
                <span className="text-text dark:text-text-dark">{account.name}</span>
              </div>
            )}
            {category && (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Categoria: </span>
                <span className="text-text dark:text-text-dark">{category.name}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Prazo: </span>
              <span className="text-text dark:text-text-dark">
                {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>
            {daysUntilDeadline > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Dias restantes: </span>
                <span className="text-text dark:text-text-dark font-semibold">
                  {daysUntilDeadline}
                </span>
              </div>
            )}
          </div>

          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            O progresso desta meta é calculado automaticamente com base nos lançamentos da conta
            vinculada.
          </p>

          {/* Ações */}
          <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(goal)}
              disabled={isUpdating}
              className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(goal.id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Informações principais */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-3">
              {category && (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                >
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                    {goal.name}
                  </h3>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getStatusBadgeColor(goal.status as GoalStatus),
                    )}
                  >
                    {getStatusLabel(goal.status as GoalStatus)}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {goal.description}
                  </p>
                )}
                <div className="mb-3">
                  <Progress value={progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{progress}% concluído</span>
                    <span>
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  {account && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Conta vinculada: </span>
                      <span className="text-text dark:text-text-dark">{account.name}</span>
                    </div>
                  )}
                  {category && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Categoria: </span>
                      <span className="text-text dark:text-text-dark">{category.name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Prazo: </span>
                    <span className="text-text dark:text-text-dark">
                      {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  {daysUntilDeadline > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Dias restantes: </span>
                      <span className="text-text dark:text-text-dark font-semibold">
                        {daysUntilDeadline}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 md:flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(goal)}
              disabled={isUpdating}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(goal.id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
