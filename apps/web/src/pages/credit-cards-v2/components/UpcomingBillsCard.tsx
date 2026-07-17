import { ArrowRight, CreditCard } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '@/utils/formatters';

import type { CreditCardOverview } from '../mappers/buildCreditCardOverview';

import { formatShortDayMonth } from './formatShortDayMonth';

interface UpcomingBillsCardProps {
  readonly overviews: ReadonlyArray<CreditCardOverview>;
}

export function UpcomingBillsCard({ overviews }: Readonly<UpcomingBillsCardProps>) {
  const navigate = useNavigate();

  const upcoming = useMemo(
    () =>
      overviews
        .filter(
          (overview): overview is CreditCardOverview & { currentBillDueDate: string } =>
            overview.isActive && overview.currentBillDueDate !== null,
        )
        .sort((a, b) => a.currentBillDueDate.localeCompare(b.currentBillDueDate)),
    [overviews],
  );

  return (
    <section
      aria-label="Faturas próximas"
      className="flex flex-1 flex-col rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
    >
      <h2 className="text-sm font-semibold text-text dark:text-text-dark">Faturas próximas</h2>

      {upcoming.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Nenhuma fatura em aberto nos cartões conectados.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {upcoming.map((overview) => (
            <li
              key={overview.cardId}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 dark:border-border-dark/60 dark:bg-background-dark/40"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: overview.color }}
                  aria-hidden
                >
                  <CreditCard className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text dark:text-text-dark">
                    {overview.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Vencimento da fatura</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold text-muted-foreground">
                  {formatShortDayMonth(overview.currentBillDueDate)}
                </p>
                <p className="text-xs font-bold tabular-nums text-text dark:text-text-dark">
                  {formatCurrency(overview.currentBillAmount ?? 0)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => navigate('/credit-cards/bills')}
        className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        Ver todas as faturas
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </section>
  );
}
