import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/transaction';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface TransactionTypeSelectorProps {
  transactionType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export function TransactionTypeSelector({
  transactionType,
  onTypeChange,
}: Readonly<TransactionTypeSelectorProps>) {
  return (
    <div className="p-3 pb-0 bg-background dark:bg-background-dark rounded-t-lg flex justify-center">
      <div className="grid grid-cols-2 gap-1 p-1 bg-muted dark:bg-muted/20 rounded-xl w-full max-w-sm border border-border/50">
        <button
          type="button"
          onClick={() => onTypeChange('EXPENSE')}
          className={cn(
            'py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm',
            transactionType === 'EXPENSE'
              ? 'bg-background dark:bg-card text-red-600 dark:text-red-400 shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
          )}
        >
          <ArrowDownCircle className={cn("h-4 w-4", transactionType === 'EXPENSE' ? "text-red-600 dark:text-red-400" : "text-muted-foreground")} />
          <span>Despesa</span>
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('INCOME')}
          className={cn(
            'py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm',
            transactionType === 'INCOME'
              ? 'bg-background dark:bg-card text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
          )}
        >
          <ArrowUpCircle className={cn("h-4 w-4", transactionType === 'INCOME' ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")} />
          <span>Receita</span>
        </button>
      </div>
    </div>
  );
}

