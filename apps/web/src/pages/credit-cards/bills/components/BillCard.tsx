import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { BillTransactionList } from './BillTransactionList';

interface BillCardProps {
  readonly month: string;
  readonly billTotal: number;
  readonly dueDate: string;
  readonly status: 'OPEN' | 'CLOSED' | 'PAID';
  readonly transactions: ReadonlyArray<{
    readonly id: string;
    readonly date: string;
    readonly description: string;
    readonly amount: number;
    readonly category?: string;
    readonly installment?: string;
  }>;
  readonly totalTransactions: number;
  readonly isLoadingMore: boolean;
  readonly hasMore: boolean;
  readonly onLoadMore: () => Promise<void>;
  readonly onPreviousMonth: () => void;
  readonly onNextMonth: () => void;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
}

export function BillCard({
  month,
  billTotal,
  dueDate,
  status,
  transactions,
  totalTransactions,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious,
  canGoNext,
}: BillCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatMonthYear = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-').map(Number);
    const date = new Date(year, monthNum - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatDueDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'PAID':
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            Paga
          </span>
        );
      case 'CLOSED':
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
            Fechada
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            Aberta
          </span>
        );
    }
  };

  return (
    <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div className="p-5 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onPreviousMonth}
              disabled={!canGoPrevious}
              className="p-2 rounded-lg border border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-text-dark capitalize">
                {formatMonthYear(month)}
              </h3>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Vencimento em {formatDueDate(dueDate)}
              </p>
            </div>
            <button
              onClick={onNextMonth}
              disabled={!canGoNext}
              className="p-2 rounded-lg border border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
            </button>
          </div>

          <div className="text-right">
            {getStatusBadge()}
            <p className="text-2xl font-bold text-text dark:text-text-dark mt-1">
              {formatCurrency(billTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-background/50 dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
            <span className="text-sm font-medium text-text dark:text-text-dark">Transações</span>
          </div>
          <span className="text-xs text-text-muted dark:text-text-muted-dark bg-background dark:bg-background-dark px-2 py-1 rounded-full">
            {totalTransactions} {totalTransactions === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        <BillTransactionList
          transactions={transactions}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
        />
      </div>
    </div>
  );
}
