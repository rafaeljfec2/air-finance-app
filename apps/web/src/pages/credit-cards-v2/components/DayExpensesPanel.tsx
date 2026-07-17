import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Upload } from 'lucide-react';
import { useMemo } from 'react';

import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useDayExpenses } from '@/pages/dashboard/hooks/useDayExpenses';
import { buildDayExpensesCsv } from '@/pages/dashboard/utils/buildDayExpensesCsv';
import {
  buildDayExpensesSummary,
  type DayExpenseGroup,
  type DayExpenseRow,
} from '@/pages/dashboard/utils/buildDayExpensesSummary';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { parseLocalDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';

import { filterTransactionsByAccountIds } from '../mappers/filterTransactionsByAccountIds';

interface DayExpensesPanelProps {
  readonly companyId: string;
  readonly date: string;
  readonly accountId: string;
  readonly onOpenDayDetails: () => void;
  readonly className?: string;
}

interface FlatExpenseRow {
  readonly row: DayExpenseRow;
  readonly group: DayExpenseGroup;
}

const ROW_GRID =
  'grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_5.5rem] items-center gap-3';

function downloadCsv(csv: string, date: string) {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `despesas-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function ExpenseTableRow({ row, group }: Readonly<FlatExpenseRow>) {
  const CategoryIcon = getCategoryIcon(row.categoryName, 'expense');

  return (
    <li className={`px-3 py-3 ${ROW_GRID}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${row.categoryColor}26`, color: row.categoryColor }}
          aria-hidden
        >
          <CategoryIcon className="h-4 w-4" />
        </span>
        <p className="truncate text-sm text-text dark:text-text-dark">{row.description}</p>
      </div>

      <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: row.categoryColor }}
          aria-hidden
        />
        <span className="truncate">{row.categoryName}</span>
      </span>

      <span className="truncate text-xs text-muted-foreground">{group.paymentMethodLabel}</span>

      <span className="text-right text-sm font-medium tabular-nums text-red-500 dark:text-red-400">
        {formatCurrency(-row.amount)}
      </span>
    </li>
  );
}

function PanelLoading() {
  return (
    <div data-testid="day-expenses-panel-loading" className="space-y-2 px-4 pb-4" aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <span
          key={`row-${index}`}
          className="block h-12 w-full animate-pulse rounded-lg bg-muted/40 dark:bg-muted/20"
        />
      ))}
    </div>
  );
}

export function DayExpensesPanel({
  companyId,
  date,
  accountId,
  onOpenDayDetails,
  className,
}: Readonly<DayExpensesPanelProps>) {
  const query = useDayExpenses(companyId, date);
  const { accounts } = useAccounts();
  const { categories } = useCategories(companyId);

  const summary = useMemo(() => {
    const accountIds = new Set(accountId ? [accountId] : []);
    const transactions = filterTransactionsByAccountIds(query.data ?? [], accountIds);
    return buildDayExpensesSummary(transactions, accounts ?? [], categories ?? []);
  }, [query.data, accounts, categories, accountId]);

  const flatRows = useMemo<FlatExpenseRow[]>(
    () => summary.groups.flatMap((group) => group.rows.map((row) => ({ row, group }))),
    [summary.groups],
  );

  const titleDate = format(parseLocalDate(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <section
      aria-label={`Despesas de ${titleDate}`}
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark ${className ?? ''}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-text dark:text-text-dark">
              Despesas de {titleDate}
            </h2>
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:bg-background-dark">
              {summary.count} despesas
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Despesas do cartão selecionado</p>
        </div>

        <button
          type="button"
          onClick={() => downloadCsv(buildDayExpensesCsv(summary), date)}
          disabled={summary.count === 0}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border-dark dark:text-text-dark dark:hover:bg-background-dark/60"
        >
          <Upload className="h-3.5 w-3.5" aria-hidden />
          Exportar
        </button>
      </header>

      {query.isLoading ? (
        <div className="pt-4">
          <PanelLoading />
        </div>
      ) : query.isError ? (
        <p className="mx-4 my-6 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-6 text-center text-sm text-red-500 dark:text-red-400">
          Não foi possível carregar as despesas deste dia.
        </p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col px-2 pt-3">
          <div
            className={`px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${ROW_GRID}`}
            aria-hidden
          >
            <span>Descrição</span>
            <span>Categoria</span>
            <span>Forma de pagamento</span>
            <span className="text-right">Valor</span>
          </div>

          {flatRows.length === 0 ? (
            <div className="mx-2 mb-4 flex flex-1 items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 dark:border-border-dark">
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma despesa registrada neste dia.
              </p>
            </div>
          ) : (
            <ul className="min-h-0 flex-1 divide-y divide-border/20 overflow-y-auto border-t border-border/25 dark:divide-white/5 dark:border-white/10">
              {flatRows.map(({ row, group }) => (
                <ExpenseTableRow key={row.id} row={row} group={group} />
              ))}
            </ul>
          )}
        </div>
      )}

      <footer className="mt-auto px-4 pb-4 pt-2">
        <button
          type="button"
          onClick={onOpenDayDetails}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Ver todas as despesas do dia
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </footer>
    </section>
  );
}
