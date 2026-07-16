import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { DashboardSummary } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

import {
  daysElapsedInMonth,
  expenseDailyAverage,
  incomeExpenseBarShares,
} from '../../desk/deskMetrics';

interface MonthSummaryCardProps {
  readonly summary: DashboardSummary | null;
  readonly movementCount: number;
}

export function MonthSummaryCard({ summary, movementCount }: Readonly<MonthSummaryCardProps>) {
  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;
  const balance = summary?.balance ?? 0;
  const daysElapsed = daysElapsedInMonth();
  const dailyAverage = expenseDailyAverage(expenses, daysElapsed);
  const { incomeShare, expenseShare } = incomeExpenseBarShares(income, expenses);
  const monthLabel = format(new Date(), 'MMMM', { locale: ptBR });
  const monthTitle = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <section
      aria-label="Resumo do mês"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-border-dark dark:bg-card-dark"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-text dark:text-text-dark">Resumo do mês</h2>
        <span className="inline-flex items-center gap-0.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-text-muted dark:border-border-dark dark:text-text-muted-dark">
          {monthTitle}
          <ChevronRight className="h-3 w-3" aria-hidden />
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 divide-x divide-border dark:divide-border-dark">
        <div className="pr-3">
          <p className="text-xs text-text-muted dark:text-text-muted-dark">Entradas</p>
          <p className="mt-1 text-base font-bold tabular-nums text-emerald-500 sm:text-lg">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="px-3">
          <p className="text-xs text-text-muted dark:text-text-muted-dark">Saídas</p>
          <p className="mt-1 text-base font-bold tabular-nums text-red-500 sm:text-lg">
            {formatCurrency(expenses)}
          </p>
        </div>
        <div className="pl-3">
          <p className="text-xs text-text-muted dark:text-text-muted-dark">Saldo do período</p>
          <p className="mt-1 text-base font-bold tabular-nums text-text dark:text-text-dark sm:text-lg">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div
        className="mt-3 flex h-2 overflow-hidden rounded-full bg-border/60 dark:bg-border-dark/60"
        aria-hidden
      >
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${Math.round(incomeShare * 100)}%` }}
        />
        <div
          className="h-full bg-red-500"
          style={{ width: `${Math.round(expenseShare * 100)}%` }}
        />
      </div>

      <div className="mb-3 mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 dark:border-border-dark">
        <div>
          <p className="text-sm font-bold tabular-nums text-text dark:text-text-dark">
            {movementCount}
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">movimentos</p>
        </div>
        <div>
          <p className="text-sm font-bold tabular-nums text-text dark:text-text-dark">
            {daysElapsed}
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">dias decorridos</p>
        </div>
        <div>
          <p className="text-sm font-bold tabular-nums text-text dark:text-text-dark">
            {formatCurrency(dailyAverage)}
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">média diária</p>
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-3 dark:border-border-dark">
        <Link
          to="/dashboard"
          className="inline-flex text-sm font-medium text-emerald-500 hover:text-emerald-400"
        >
          Ver dashboard completo →
        </Link>
      </div>
    </section>
  );
}
