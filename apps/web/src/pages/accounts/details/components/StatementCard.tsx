import React from 'react';
import { ChevronLeft, ChevronRight, Receipt, Search, X } from 'lucide-react';
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
  readonly searchTerm?: string;
  readonly onSearchChange?: (term: string) => void;
  readonly isSearching?: boolean;
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
  searchTerm = '',
  onSearchChange,
  isSearching = false,
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Receipt className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
            <span className="text-xs font-medium text-text dark:text-text-dark">Transações</span>
            <span className="text-[10px] text-text-muted dark:text-text-muted-dark bg-background dark:bg-background-dark px-2 py-0.5 rounded-full">
              {totalTransactions} {transactionLabel}
            </span>
          </div>

          {onSearchChange && (
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
                <input
                  type="text"
                  placeholder="Pesquisar transações..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-text dark:text-text-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark"
                />
                {searchTerm && !isSearching && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-background-dark/10 dark:hover:bg-background/10 rounded"
                    aria-label="Limpar busca"
                  >
                    <X className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="h-3.5 w-3.5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          )}
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
