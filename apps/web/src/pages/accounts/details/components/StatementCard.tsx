import React from 'react';
import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { StatementTransactionList } from './StatementTransactionList';
import { AccountEmptyState } from './AccountEmptyState';
import type { StatementTransaction } from '@/services/bankingStatementService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StatementCardProps {
  readonly month: string;
  readonly transactions: ReadonlyArray<StatementTransaction>;
  readonly totalTransactions: number;
  readonly isLoadingMore: boolean;
  readonly hasMore: boolean;
  readonly onLoadMore: () => Promise<void>;
  readonly onPreviousMonth: () => void;
  readonly onNextMonth: () => void;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
}

const formatMonthYear = (monthStr: string): string => {
  const [year, monthNum] = monthStr.split('-').map(Number);
  const date = new Date(year, monthNum - 1, 1);
  return format(date, 'MMMM yyyy', { locale: ptBR });
};

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
    className="p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export function StatementCard({
  month,
  transactions,
  totalTransactions,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious,
  canGoNext,
}: StatementCardProps) {
  const transactionLabel = totalTransactions === 1 ? 'item' : 'itens';

  return (
    <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div className="px-4 py-3 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-center gap-2">
          <NavigationButton
            onClick={onPreviousMonth}
            disabled={!canGoPrevious}
            ariaLabel="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
          </NavigationButton>
          <h3 className="text-base font-semibold text-text dark:text-text-dark capitalize min-w-[160px] text-center">
            {formatMonthYear(month)}
          </h3>
          <NavigationButton onClick={onNextMonth} disabled={!canGoNext} ariaLabel="Próximo mês">
            <ChevronRight className="h-5 w-5 text-text dark:text-text-dark" />
          </NavigationButton>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-background/50 dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
            <span className="text-sm font-medium text-text dark:text-text-dark">Transações</span>
          </div>
          <span className="text-xs text-text-muted dark:text-text-muted-dark">
            {totalTransactions} {transactionLabel}
          </span>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto">
        {transactions.length > 0 ? (
          <StatementTransactionList
            transactions={transactions}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
          />
        ) : (
          <AccountEmptyState />
        )}
      </div>
    </div>
  );
}
