import { Progress } from '@/components/ui/progress';
import { useCategories } from '@/hooks/useCategories';
import { useGoals } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';
import { Goal } from '@/services/goalService';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, Target, Calendar, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const statusOptions = [
  { value: 'active', label: 'Ativa', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
  {
    value: 'completed',
    label: 'Concluída',
    color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  },
  { value: 'cancelled', label: 'Cancelada', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' },
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
    <div className="w-full rounded-lg transition-all text-left bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50">
      <div className="flex items-start justify-between gap-2.5 mb-2">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Ícone */}
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
            {/* Nome */}
            <h3 className="font-bold text-sm text-text dark:text-text-dark mb-1 line-clamp-1">
              {goal.name}
            </h3>

            {/* Badge Status */}
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                getStatusBadgeColor(goal.status as GoalStatus),
              )}
            >
              {getStatusLabel(goal.status as GoalStatus)}
            </span>
          </div>
        </div>

        {/* Menu Vertical */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 data-[state=open]:bg-muted"
                disabled={isUpdating || isDeleting}
              >
                <span className="sr-only">Abrir menu</span>
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
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <Progress value={progress} className="h-2 mb-1" />
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span className="font-semibold">{progress}%</span>
          <span className="font-mono">
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>

      {/* Informações Compactas */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {/* Prazo */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-600 dark:text-gray-300 truncate text-[11px]">
            {format(new Date(goal.deadline), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>

        {/* Dias Restantes */}
        {daysUntilDeadline > 0 && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-300 truncate text-[11px]">
              {daysUntilDeadline} dias
            </span>
          </div>
        )}

        {/* Categoria */}
        {category && (
          <div className="col-span-2 flex items-center gap-1.5 min-w-0">
            <TrendingUp className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-300 truncate text-[11px]">
              {category.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
