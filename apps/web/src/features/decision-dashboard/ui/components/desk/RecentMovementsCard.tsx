import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Car, Heart, Home, Landmark, ShoppingBag, ShoppingCart, Utensils } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

import type { DeskRecentMovement } from '../../desk/mapRecentMovementsWithBalance';

interface RecentMovementsCardProps {
  readonly movements: readonly DeskRecentMovement[];
  readonly isLoading: boolean;
}

function formatMovementTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return format(date, 'HH:mm', { locale: ptBR });
}

function resolveMovementIcon(movement: DeskRecentMovement): LucideIcon {
  if (movement.launchType === 'revenue') {
    return Landmark;
  }
  const category = movement.categoryLabel.toLowerCase();
  if (category.includes('mercado')) {
    return ShoppingCart;
  }
  if (category.includes('aliment')) {
    return Utensils;
  }
  if (category.includes('transport') || category.includes('carro')) {
    return Car;
  }
  if (category.includes('moradia') || category.includes('casa')) {
    return Home;
  }
  if (category.includes('saúde') || category.includes('saude')) {
    return Heart;
  }
  return ShoppingBag;
}

export function RecentMovementsCard({ movements, isLoading }: Readonly<RecentMovementsCardProps>) {
  return (
    <section
      aria-label="Últimos movimentos"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-border-dark dark:bg-card-dark"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-text dark:text-text-dark">Últimos movimentos</h2>
        <Link
          to="/movements"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
        >
          <span>Ver todos</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3" aria-busy="true" aria-label="Carregando movimentos">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${String(index)}`}
              className="h-14 animate-pulse rounded-xl bg-border/40 dark:bg-border-dark/40"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && movements.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted dark:text-text-muted-dark">
          Nenhum movimento recente neste mês.
        </p>
      ) : null}

      {!isLoading && movements.length > 0 ? (
        <ul className="mt-3 divide-y divide-border dark:divide-border-dark">
          {movements.map((movement) => {
            const isRevenue = movement.launchType === 'revenue';
            const Icon = resolveMovementIcon(movement);
            return (
              <li key={movement.id} className="flex min-h-14 items-center gap-3 py-2.5">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                    isRevenue
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/40 bg-red-500/10 text-red-400',
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text dark:text-text-dark">
                    {movement.description}
                  </p>
                  <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">
                    {movement.categoryLabel} • {movement.accountLabel}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      isRevenue ? 'text-emerald-500' : 'text-red-500',
                    )}
                  >
                    {isRevenue ? '+' : '-'}
                    {formatCurrency(Math.abs(movement.value))}
                  </p>
                  <p className="text-[10px] text-text-muted dark:text-text-muted-dark">
                    {formatMovementTime(movement.paymentDate)}
                  </p>
                </div>
                <div className="hidden shrink-0 items-baseline justify-end gap-1.5 sm:flex sm:w-40">
                  <span className="text-sm font-bold tabular-nums text-text dark:text-text-dark">
                    {formatCurrency(movement.balanceAfter)}
                  </span>
                  <span className="text-[10px] text-text-muted dark:text-text-muted-dark">
                    Saldo após
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="mt-auto border-t border-border pt-3 dark:border-border-dark">
        <Link
          to="/movements"
          className="inline-flex text-sm font-medium text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
        >
          Acessar movimentos financeiros →
        </Link>
      </div>
    </section>
  );
}
