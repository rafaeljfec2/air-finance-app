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
    <div className="p-3 sm:p-4 bg-background dark:bg-background-dark rounded-t-lg">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onTypeChange('EXPENSE')}
          className={cn(
            'p-2 rounded-lg border flex items-center justify-center gap-2 transition-all font-medium',
            transactionType === 'EXPENSE'
              ? 'bg-red-600 border-red-600 text-white dark:bg-red-500 dark:border-red-500 dark:text-white shadow-md'
              : 'border-border dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark hover:border-primary-500 dark:hover:border-primary-400',
          )}
        >
          <ArrowDownCircle className="h-4 w-4" />
          <span className="text-sm">Despesa</span>
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('INCOME')}
          className={cn(
            'p-2 rounded-lg border flex items-center justify-center gap-2 transition-all font-medium',
            transactionType === 'INCOME'
              ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-white shadow-md'
              : 'border-border dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark hover:border-primary-500 dark:hover:border-primary-400',
          )}
        >
          <ArrowUpCircle className="h-4 w-4" />
          <span className="text-sm">Receita</span>
        </button>
      </div>
    </div>
  );
}

