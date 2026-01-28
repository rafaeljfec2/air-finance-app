import React from 'react';
import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { StatementTransactionList } from './StatementTransactionList';
import { AccountEmptyState } from './AccountEmptyState';
import type { StatementTransaction } from '@/services/bankingStatementService';
import type { StatementSummary } from '../hooks/types';
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
  readonly summary?: StatementSummary;
}

const formatMonthYear = (monthStr: string): string => {
  const [year, monthNum] = monthStr.split('-').map(Number);
  const date = new Date(year, monthNum - 1, 1);
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
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
    className="p-2 rounded-lg border border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
  summary,
}: StatementCardProps) {
  const transactionLabel = totalTransactions === 1 ? 'item' : 'itens';
  const endBalance = summary?.endBalance ?? 0;
  const isPositive = endBalance >= 0;

  return (
    <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div className="px-4 py-3 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NavigationButton
              onClick={onPreviousMonth}
              disabled={!canGoPrevious}
              ariaLabel="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
            </NavigationButton>
            <div>
              <h3 className="text-base font-semibold text-text dark:text-text-dark capitalize">
                {formatMonthYear(month)}
              </h3>
              <p className="text-[10px] text-text-muted dark:text-text-muted-dark">
                Extrato do período
              </p>
            </div>
            <NavigationButton onClick={onNextMonth} disabled={!canGoNext} ariaLabel="Próximo mês">
              <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
            </NavigationButton>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-text-muted dark:text-text-muted-dark">
              Saldo final
            </span>
            <p className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(endBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-background/50 dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
            <span className="text-xs font-medium text-text dark:text-text-dark">Transações</span>
          </div>
          <span className="text-[10px] text-text-muted dark:text-text-muted-dark bg-background dark:bg-background-dark px-2 py-0.5 rounded-full">
            {totalTransactions} {transactionLabel}
          </span>
        </div>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
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
