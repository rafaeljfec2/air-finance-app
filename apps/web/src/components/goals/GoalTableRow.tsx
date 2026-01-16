import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

interface GoalTableRowProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function GoalTableRow({
  goal,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<GoalTableRowProps>) {
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
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {category && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: category.color }}
            >
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          )}
          <div>
            <div className="font-medium text-text dark:text-text-dark">{goal.name}</div>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1',
                getStatusBadgeColor(goal.status as GoalStatus),
              )}
            >
              {getStatusLabel(goal.status as GoalStatus)}
            </span>
          </div>
        </div>
      </td>
      <td className="p-4 w-1/4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm">
           <span className="text-gray-500 dark:text-gray-400 text-xs">Atual/Meta: </span>
           <div className="text-text dark:text-text-dark font-medium">
             {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
           </div>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-text dark:text-text-dark">
          {format(new Date(goal.deadline), "dd/MM/yyyy", {
            locale: ptBR,
          })}
          {daysUntilDeadline > 0 && (
             <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
               Restam {daysUntilDeadline} dias
             </div>
          )}
        </div>
      </td>
       <td className="p-4">
        <div className="flex justify-end gap-2">
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
      </td>
    </tr>
  );
}
