import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { BillTransactionList } from './BillTransactionList';
import { formatCurrency, formatMonthYear, formatDueDate, type BillStatus, getStatusBadgeClasses } from '../utils';

const STATUS_LABELS: Record<BillStatus, string> = {
  PAID: 'Paga',
  CLOSED: 'Fechada',
  OPEN: 'Aberta',
};

interface Transaction {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly amount: number;
  readonly category?: string;
  readonly installment?: string;
}

interface BillCardProps {
  readonly month: string;
  readonly billTotal: number;
  readonly dueDate: string;
  readonly status: BillStatus;
  readonly transactions: ReadonlyArray<Transaction>;
  readonly totalTransactions: number;
  readonly isLoadingMore: boolean;
  readonly hasMore: boolean;
  readonly onLoadMore: () => Promise<void>;
  readonly onPreviousMonth: () => void;
  readonly onNextMonth: () => void;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
}

const NavigationButton = ({
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly ariaLabel: string;
  readonly children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 rounded-lg border border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

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
  const statusLabel = STATUS_LABELS[status];
  const transactionLabel = totalTransactions === 1 ? 'item' : 'itens';

  return (
    <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div className="p-5 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <NavigationButton
              onClick={onPreviousMonth}
              disabled={!canGoPrevious}
              ariaLabel="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
            </NavigationButton>
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-text-dark capitalize">
                {formatMonthYear(month)}
              </h3>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Vencimento em {formatDueDate(dueDate)}
              </p>
            </div>
            <NavigationButton
              onClick={onNextMonth}
              disabled={!canGoNext}
              ariaLabel="Próximo mês"
            >
              <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
            </NavigationButton>
          </div>

          <div className="text-right">
            <span className={getStatusBadgeClasses(status)}>
              {statusLabel}
            </span>
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
            {totalTransactions} {transactionLabel}
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
