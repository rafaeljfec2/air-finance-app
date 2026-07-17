import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, CreditCard, Info, Landmark, Upload } from 'lucide-react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

import { Modal } from '@/components/ui/Modal';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { parseLocalDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';

import { useDayExpenses } from '../hooks/useDayExpenses';
import { buildDayExpensesCsv } from '../utils/buildDayExpensesCsv';
import {
  buildDayExpensesSummary,
  type DayExpenseGroup,
  type DayExpenseRow,
  type DayExpensesSummary,
} from '../utils/buildDayExpensesSummary';

interface DayExpensesModalProps {
  readonly companyId: string;
  readonly date: string | null;
  readonly onClose: () => void;
  /** When set, only expenses from this account are shown (credit-cards screen). */
  readonly accountId?: string;
}

const ROW_GRID =
  'sm:grid sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_6.5rem] sm:items-center sm:gap-3';

function formatDayTitle(date: string): string {
  const parsed = parseLocalDate(date);
  const day = format(parsed, 'd', { locale: ptBR });
  const month = format(parsed, 'MMMM', { locale: ptBR });
  const year = format(parsed, 'yyyy', { locale: ptBR });
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${day} de ${capitalizedMonth} de ${year}`;
}

function downloadCsv(csv: string, date: string) {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `despesas-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({
  label,
  value,
  emphasis,
}: Readonly<{ label: string; value: string; emphasis?: boolean }>) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5 dark:border-border-dark dark:bg-background-dark/40">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p
        className={
          emphasis
            ? 'mt-0.5 text-base font-semibold tabular-nums text-red-500 dark:text-red-400'
            : 'mt-0.5 text-base font-semibold tabular-nums text-text dark:text-text-dark'
        }
      >
        {value}
      </p>
    </div>
  );
}

function ColumnHeaders() {
  return (
    <div
      className={`hidden border-b border-border/25 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:border-white/10 ${ROW_GRID}`}
      aria-hidden
    >
      <span>Descrição</span>
      <span>Categoria</span>
      <span>Forma de pagamento</span>
      <span className="text-right">Valor</span>
    </div>
  );
}

function GroupHeader({ group }: Readonly<{ group: DayExpenseGroup }>) {
  const KindIcon = group.kind === 'card' ? CreditCard : Landmark;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-background/60 px-3 py-2 dark:bg-background-dark/60">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: group.accountColor }}
          aria-hidden
        >
          <KindIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text dark:text-text-dark">
            {group.accountName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {group.kindLabel}
            {group.maskedNumber ? ` · ${group.maskedNumber}` : ''} · {group.paymentMethodLabel}
          </p>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-red-500 dark:text-red-400">
        {formatCurrency(group.subtotal)}
      </span>
    </div>
  );
}

function ExpenseRow({
  row,
  paymentMethodLabel,
}: Readonly<{ row: DayExpenseRow; paymentMethodLabel: string }>) {
  const CategoryIcon = getCategoryIcon(row.categoryName, 'expense');

  return (
    <li className={`px-3 py-3.5 ${ROW_GRID}`}>
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

      <span className="mt-1 flex min-w-0 items-center gap-1.5 pl-[42px] text-xs text-muted-foreground sm:mt-0 sm:pl-0">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: row.categoryColor }}
          aria-hidden
        />
        <span className="truncate">{row.categoryName}</span>
      </span>

      <span className="hidden text-xs text-muted-foreground sm:block">{paymentMethodLabel}</span>

      <span className="mt-1 block pl-[42px] text-sm font-medium tabular-nums text-red-500 dark:text-red-400 sm:mt-0 sm:pl-0 sm:text-right">
        {formatCurrency(-row.amount)}
      </span>
    </li>
  );
}

function DayExpensesBody({
  summary,
  scopedToCard,
}: Readonly<{ summary: DayExpensesSummary; scopedToCard: boolean }>) {
  if (summary.count === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground dark:border-border-dark">
        Nenhuma despesa registrada neste dia.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatCard label="Total de despesas" value={formatCurrency(summary.total)} emphasis />
        <StatCard label="Quantidade" value={`${summary.count} despesas`} />
        <StatCard label="Média por despesa" value={formatCurrency(summary.average)} />
        <StatCard
          label={scopedToCard ? 'Cartão' : 'Caixas utilizados'}
          value={
            scopedToCard
              ? `${summary.accountsUsed} cartão`
              : `${summary.accountsUsed} contas/cartões`
          }
        />
      </div>

      <div>
        <ColumnHeaders />
        <div className="space-y-3 pt-3">
          {summary.groups.map((group) => (
            <div key={group.accountId} className="space-y-1">
              <GroupHeader group={group} />
              <ul className="divide-y divide-border/15 dark:divide-white/5">
                {group.rows.map((row) => (
                  <ExpenseRow
                    key={row.id}
                    row={row}
                    paymentMethodLabel={group.paymentMethodLabel}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 text-[11px] text-muted-foreground dark:border-border-dark/60 dark:bg-background-dark/40">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {scopedToCard
          ? 'Os valores consideram as despesas do cartão selecionado neste dia.'
          : 'Os valores consideram todas as despesas registradas neste dia, em todos os caixas e cartões.'}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div data-testid="day-expenses-loading" className="space-y-4" aria-hidden>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={`stat-${index}`}
            className="h-16 w-full animate-pulse rounded-lg bg-muted/40 dark:bg-muted/20"
          />
        ))}
      </div>
      {Array.from({ length: 2 }, (_, index) => (
        <span
          key={`group-${index}`}
          className="block h-24 w-full animate-pulse rounded-lg bg-muted/40 dark:bg-muted/20"
        />
      ))}
    </div>
  );
}

export function DayExpensesModal({ companyId, date, onClose, accountId }: DayExpensesModalProps) {
  const query = useDayExpenses(companyId, date);
  const { accounts } = useAccounts();
  const { categories } = useCategories(companyId);
  const scopedToCard = Boolean(accountId);

  const summary = useMemo(() => {
    const transactions = accountId
      ? (query.data ?? []).filter((transaction) => transaction.accountId === accountId)
      : (query.data ?? []);
    return buildDayExpensesSummary(transactions, accounts ?? [], categories ?? []);
  }, [query.data, accounts, categories, accountId]);

  if (!date) {
    return null;
  }

  const handleExport = () => {
    downloadCsv(buildDayExpensesCsv(summary), date);
  };

  return createPortal(
    <Modal open onClose={onClose} className="max-w-3xl h-[52rem] flex flex-col overflow-hidden">
      <header className="flex items-start gap-3 pr-10">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text dark:border-border-dark dark:text-text-dark"
          aria-hidden
        >
          <CalendarDays className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text dark:text-text-dark sm:text-lg">
            Despesas do dia {formatDayTitle(date)}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {scopedToCard
              ? 'Despesas do cartão selecionado.'
              : 'Todas as despesas registradas em todos os caixas e cartões.'}
          </p>
        </div>
      </header>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleExport}
          disabled={summary.count === 0}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border-dark dark:text-text-dark dark:hover:bg-background-dark/60"
        >
          <Upload className="h-3.5 w-3.5" aria-hidden />
          Exportar
        </button>
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-6 text-center text-sm text-red-500 dark:text-red-400">
            Não foi possível carregar as despesas deste dia.
          </p>
        ) : (
          <DayExpensesBody summary={summary} scopedToCard={scopedToCard} />
        )}
      </div>
    </Modal>,
    document.body,
  );
}
