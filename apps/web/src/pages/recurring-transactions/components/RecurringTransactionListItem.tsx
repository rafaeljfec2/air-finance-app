import { RecurringTransaction } from '@/services/recurringTransactionService';
import { formatCurrency } from '@/utils/formatters';
import { MoreVertical, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RecurringTransactionListItemProps {
  recurringTransaction: RecurringTransaction;
  onEdit: (recurringTransaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const frequencyLabels: Record<string, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

export function RecurringTransactionListItem({
  recurringTransaction,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<RecurringTransactionListItemProps>) {
  const isIncome = recurringTransaction.type === 'Income';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex items-center gap-2.5 p-2 bg-card dark:bg-card-dark hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors rounded-lg border border-border/50 dark:border-border-dark/50">
      {/* Ícone de tipo */}
      <div
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
          isIncome ? 'bg-emerald-500/20' : 'bg-red-500/20',
        )}
      >
        {isIncome ? (
          <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
        ) : (
          <ArrowDownCircle className="h-4 w-4 text-red-400" />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-semibold text-[13px] text-text dark:text-text-dark truncate leading-tight flex-1 min-w-0">
            {recurringTransaction.description}
          </h3>
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0',
              isIncome
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
            )}
          >
            {isIncome ? 'Receita' : 'Despesa'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <span>{frequencyLabels[recurringTransaction.frequency]}</span>
          <span>•</span>
          <span>{formatDate(recurringTransaction.startDate)}</span>
        </div>
      </div>

      {/* Valor */}
      <div className="text-right shrink-0">
        <span className="text-[13px] font-bold text-text dark:text-text-dark block">
          {formatCurrency(recurringTransaction.value)}
        </span>
      </div>

      {/* Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            disabled={isUpdating || isDeleting}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="end">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEdit(recurringTransaction)}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Editar
            </button>
            <button
              onClick={() => onDelete(recurringTransaction.id)}
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
