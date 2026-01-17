import { Goal } from '@/services/goalService';
import { formatCurrency } from '@/utils/formatters';
import { Target, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGoals } from '@/hooks/useGoals';
import { useCategories } from '@/hooks/useCategories';

interface GoalListItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function GoalListItem({
  goal,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<GoalListItemProps>) {
  const { data: progressData } = useGoals(goal.companyId).getProgress(goal.id);
  const { categories } = useCategories(goal.companyId);
  const category = categories?.find((c) => c.id === goal.categoryId);
  const apiProgress = progressData?.progress ?? null;
  const progress =
    apiProgress !== null
      ? apiProgress
      : Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);

  return (
    <div className="flex items-center gap-2.5 p-2 bg-card dark:bg-card-dark hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors rounded-lg border border-border/50 dark:border-border-dark/50">
      {/* Ícone com cor da categoria */}
      {category && (
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: category.color }}
        >
          <Target className="h-5 w-5 text-white" />
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[13px] text-text dark:text-text-dark truncate leading-tight">
          {goal.name}
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          {progress}% • {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
        </p>
      </div>

      {/* Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isUpdating || isDeleting}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1" align="end">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Editar
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
