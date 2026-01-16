import { RecordCard } from '@/components/ui/RecordCard';
import { Progress } from '@/components/ui/progress';
import { useCategories } from '@/hooks/useCategories';
import { useGoals } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';
import { Goal } from '@/services/goalService';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp } from 'lucide-react';

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
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<GoalCardProps>) {
  const { data: progressData } = useGoals(goal.companyId).getProgress(goal.id);
  const { categories } = useCategories(goal.companyId);
  const category = categories?.find((c) => c.id === goal.categoryId);
  const apiProgress = progressData?.progress ?? null;
  const progress =
    apiProgress !== null
      ? apiProgress
      : Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  const daysUntilDeadline = progressData?.daysUntilDeadline ?? 0;

  return (
    <RecordCard
      onEdit={() => onEdit(goal)}
      onDelete={() => onDelete(goal.id)}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {category && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: category.color }}
            >
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-1 truncate leading-tight">
              {goal.name}
            </h3>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border leading-tight',
                getStatusBadgeColor(goal.status as GoalStatus),
              )}
            >
              {getStatusLabel(goal.status as GoalStatus)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <Progress value={progress} className="h-1.5 mb-1" />
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>{progress}%</span>
          <span>
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-1">
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Prazo: </span>
          <span className="text-text dark:text-text-dark">
            {format(new Date(goal.deadline), 'dd/MM/yyyy', {
              locale: ptBR,
            })}
          </span>
        </div>
        {daysUntilDeadline > 0 && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Restam: </span>
            <span className="text-text dark:text-text-dark font-semibold">
              {daysUntilDeadline} dias
            </span>
          </div>
        )}
        {category && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Categoria: </span>
            <span className="text-text dark:text-text-dark">{category.name}</span>
          </div>
        )}
      </div>
    </RecordCard>
  );
}
