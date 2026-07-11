import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreditCard } from 'lucide-react';
import { useMemo } from 'react';

import { formatCurrencyAbsolute, parseLocalDate } from '@/pages/credit-cards/bills/utils';

import type { StatementTransactionItem } from '../mappers/mapOpeniTransactionToStatementItem';

interface StatementTransactionListProps {
  readonly transactions: ReadonlyArray<StatementTransactionItem>;
  readonly emptyMessage?: string;
}

function statusLabel(status: string): string {
  if (status === 'PENDING') return 'Pendente';
  if (status === 'POSTED') return 'Confirmado';
  return status;
}

function formatDateShort(dateStr: string): string {
  return format(parseLocalDate(dateStr), "dd 'de' MMM", { locale: ptBR });
}

function formatDateHeader(dateStr: string): string {
  return format(parseLocalDate(dateStr), "EEEE, dd 'de' MMMM", { locale: ptBR });
}

export function StatementTransactionList({
  transactions,
  emptyMessage = 'Nenhum lançamento neste período.',
}: Readonly<StatementTransactionListProps>) {
  const grouped = useMemo(() => {
    const map: Record<string, StatementTransactionItem[]> = {};
    for (const tx of transactions) {
      const key = tx.date.split('T')[0] ?? tx.date;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(tx);
    }
    return map;
  }, [transactions]);

  const sortedDates = useMemo(
    () => Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()),
    [grouped],
  );

  if (transactions.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-text-muted dark:text-text-muted-dark">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <div className="sticky top-0 z-10 bg-background/80 px-4 py-2 dark:bg-background-dark/80">
            <p className="text-xs font-medium capitalize text-text-muted dark:text-text-muted-dark">
              {formatDateHeader(dateKey)}
            </p>
          </div>
          {(grouped[dateKey] ?? []).map((tx) => {
            const isCredit = tx.type === 'CREDIT';
            const amountColorClass = isCredit
              ? 'text-green-500 dark:text-green-400'
              : 'text-blue-500 dark:text-blue-400';
            const iconBgClass = isCredit ? 'bg-green-500/20' : 'bg-blue-500/20';
            const iconColorClass = isCredit ? 'text-green-500' : 'text-blue-500';

            return (
              <div
                key={tx.id}
                className="border-b border-border/50 px-4 py-3 transition-colors last:border-b-0 hover:bg-background/50 dark:border-border-dark/50 dark:hover:bg-background-dark/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBgClass}`}
                  >
                    <CreditCard className={`h-4 w-4 ${iconColorClass}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-text dark:text-text-dark">
                        {tx.description}
                      </p>
                      {tx.installment ? (
                        <span className="shrink-0 rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          {tx.installment}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-text-muted dark:text-text-muted-dark">
                      {statusLabel(tx.status)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-semibold ${amountColorClass}`}>
                      {isCredit ? '+' : ''}
                      {formatCurrencyAbsolute(tx.amount)}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
                      {formatDateShort(tx.date)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
