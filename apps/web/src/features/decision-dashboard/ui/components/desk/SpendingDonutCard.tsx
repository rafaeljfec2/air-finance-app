import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { ExpenseByCategory } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

import { buildCategoryShares } from '../../desk/deskMetrics';

const DONUT_COLORS = ['#10B981', '#EF4444', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6'];

interface SpendingDonutCardProps {
  readonly expensesByCategory: readonly ExpenseByCategory[];
  readonly totalExpenses: number;
}

export function SpendingDonutCard({
  expensesByCategory,
  totalExpenses,
}: Readonly<SpendingDonutCardProps>) {
  const shares = useMemo(() => {
    const base = buildCategoryShares(
      expensesByCategory.map((row) => ({
        name: row.name,
        value: row.value,
        color: DONUT_COLORS[DONUT_COLORS.length - 1],
      })),
      totalExpenses,
      6,
    );
    return base.map((share, index) => ({
      ...share,
      color: DONUT_COLORS[index % DONUT_COLORS.length],
    }));
  }, [expensesByCategory, totalExpenses]);

  return (
    <section
      aria-label="Onde está indo seu dinheiro"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-border-dark dark:bg-card-dark"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-text dark:text-text-dark">
          Onde está indo seu dinheiro
        </h2>
        <Link
          to="/reports"
          className="shrink-0 text-xs font-medium text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
        >
          Ver relatório →
        </Link>
      </div>

      {shares.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted dark:text-text-muted-dark">
          Ainda não há saídas categorizadas neste mês.
        </p>
      ) : (
        <div className="mt-3 flex flex-1 flex-col items-center gap-3 sm:flex-row sm:items-center">
          <div className="relative h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[...shares]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="none"
                >
                  {shares.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border, #333)',
                    background: 'var(--card, #1a1a1a)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-base font-bold tabular-nums text-text dark:text-text-dark">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark">
                Total de saídas
              </p>
            </div>
          </div>

          <ul className="w-full min-w-0 flex-1 space-y-3">
            {shares.map((share) => (
              <li key={share.name} className="flex items-center gap-3 text-xs">
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: share.color }}
                    aria-hidden
                  />
                  <span className="truncate text-text dark:text-text-dark">{share.name}</span>
                </span>
                <span className="shrink-0 text-right font-bold tabular-nums text-text dark:text-text-dark">
                  {formatCurrency(share.value)}
                </span>
                <span className="w-12 shrink-0 text-right tabular-nums text-text-muted dark:text-text-muted-dark">
                  {share.percentage.toFixed(1).replace('.', ',')}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
