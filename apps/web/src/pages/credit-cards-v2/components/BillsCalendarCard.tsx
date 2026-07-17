import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Layers,
  Receipt,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { Account } from '@/services/accountService';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';

import { useTransactionsRange } from '../hooks/useTransactionsRange';
import { buildBillsCalendar, type BillsCalendarDay } from '../mappers/buildBillsCalendar';
import { buildDayCardStats } from '../mappers/buildDayCardStats';
import { filterTransactionsByAccountIds } from '../mappers/filterTransactionsByAccountIds';

interface BillsCalendarCardProps {
  readonly companyId: string;
  readonly accounts: ReadonlyArray<Account>;
  readonly accountId: string;
  readonly closingDays: ReadonlyArray<number>;
  readonly dueDates: ReadonlyArray<string>;
  readonly selectedDate: string;
  readonly onSelectDate: (date: string) => void;
  readonly onOpenDayDetails: () => void;
}

const WEEKDAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'] as const;

const LEGEND = [
  { label: 'Fatura fecha', className: 'bg-emerald-500' },
  { label: 'Fatura vence', className: 'bg-amber-500' },
  { label: 'Despesa registrada', className: 'bg-violet-500' },
  { label: 'Parcelas', className: 'bg-rose-500' },
] as const;

function monthRange(referenceDate: Date): { start: string; end: string } {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  return {
    start: formatDateToLocalISO(new Date(year, month, 1)),
    end: formatDateToLocalISO(new Date(year, month + 1, 0)),
  };
}

function DayMarkers({ day }: Readonly<{ day: BillsCalendarDay }>) {
  return (
    <span className="flex h-1 items-center gap-0.5" aria-hidden>
      {day.hasClosing ? <span className="h-1 w-1 rounded-full bg-emerald-500" /> : null}
      {day.hasDue ? <span className="h-1 w-1 rounded-full bg-amber-500" /> : null}
      {day.hasExpense ? <span className="h-1 w-1 rounded-full bg-violet-500" /> : null}
      {day.hasInstallment ? <span className="h-1 w-1 rounded-full bg-rose-500" /> : null}
    </span>
  );
}

interface DayStatTileProps {
  readonly icon: LucideIcon;
  readonly iconClassName: string;
  readonly value: string;
  readonly label: string;
  readonly toneClassName: string;
}

function DayStatTile({
  icon: Icon,
  iconClassName,
  value,
  label,
  toneClassName,
}: Readonly<DayStatTileProps>) {
  return (
    <div className={`rounded-lg border px-2 py-2 ${toneClassName}`}>
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3 w-3 shrink-0 ${iconClassName}`} aria-hidden />
        <p className="truncate text-xs font-bold tabular-nums text-text dark:text-text-dark">
          {value}
        </p>
      </div>
      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function BillsCalendarCard({
  companyId,
  accounts,
  accountId,
  closingDays,
  dueDates,
  selectedDate,
  onSelectDate,
  onOpenDayDetails,
}: Readonly<BillsCalendarCardProps>) {
  const [referenceDate, setReferenceDate] = useState(() => parseLocalDate(selectedDate));

  const range = useMemo(() => monthRange(referenceDate), [referenceDate]);
  const transactionsQuery = useTransactionsRange(companyId, range.start, range.end);
  const accountIds = useMemo(() => new Set(accountId ? [accountId] : []), [accountId]);
  const transactions = useMemo(
    () => filterTransactionsByAccountIds(transactionsQuery.data ?? [], accountIds),
    [transactionsQuery.data, accountIds],
  );

  const calendar = useMemo(
    () => buildBillsCalendar({ referenceDate, transactions, closingDays, dueDates }),
    [referenceDate, transactions, closingDays, dueDates],
  );

  const selectedDayTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => (transaction.paymentDate.split('T')[0] ?? '') === selectedDate,
      ),
    [transactions, selectedDate],
  );

  const dayStats = useMemo(
    () => buildDayCardStats(selectedDayTransactions, accounts),
    [selectedDayTransactions, accounts],
  );

  const monthLabel = capitalizeFirst(format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR }));
  const selectedParsed = parseLocalDate(selectedDate);
  const selectedDayLabel = format(selectedParsed, "d 'de' MMMM", { locale: ptBR });
  const selectedWeekdayLabel = capitalizeFirst(format(selectedParsed, 'EEEE', { locale: ptBR }));

  const goToMonth = (offset: number) => {
    setReferenceDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const handleSelectDay = (day: number) => {
    onSelectDate(
      formatDateToLocalISO(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day)),
    );
  };

  return (
    <section
      aria-label="Calendário de faturas"
      aria-busy={transactionsQuery.isFetching}
      className="flex flex-col rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark"
    >
      <header className="space-y-0.5 px-4 pt-4">
        <h2 className="text-sm font-semibold text-text dark:text-text-dark">
          Calendário de faturas
        </h2>
        <p className="text-xs text-muted-foreground">
          Clique no dia para ver as despesas do cartão selecionado
        </p>
      </header>

      <div className="flex items-center justify-between px-2 pt-2">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Mês anterior"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-text dark:hover:text-text-dark"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-text dark:text-text-dark">{monthLabel}</span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="Próximo mês"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-text dark:hover:text-text-dark"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        className={cn(
          'grid grid-cols-7 gap-x-1 gap-y-1 px-3 pt-1 text-center transition-opacity',
          transactionsQuery.isFetching && 'opacity-60',
        )}
      >
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="pb-1 text-[9px] font-semibold tracking-wide text-muted-foreground"
            aria-hidden
          >
            {label}
          </span>
        ))}
        {calendar.leadingDays.map((day) => (
          <span
            key={`prev-${day}`}
            className="flex h-9 items-center justify-center text-xs tabular-nums text-muted-foreground/40"
          >
            {day}
          </span>
        ))}
        {calendar.days.map((day) => {
          const iso = formatDateToLocalISO(
            new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day.day),
          );
          const isSelected = iso === selectedDate;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => handleSelectDay(day.day)}
              aria-label={`Selecionar dia ${day.day}`}
              aria-pressed={isSelected}
              className={cn(
                'flex h-9 flex-col items-center justify-center rounded-full text-xs tabular-nums transition',
                isSelected
                  ? 'font-bold text-emerald-600 ring-2 ring-emerald-500 dark:text-emerald-400'
                  : 'text-text/80 hover:bg-background dark:text-text-dark/80 dark:hover:bg-background-dark',
              )}
            >
              {day.day}
              <DayMarkers day={day} />
            </button>
          );
        })}
        {calendar.trailingDays.map((day) => (
          <span
            key={`next-${day}`}
            className="flex h-9 items-center justify-center text-xs tabular-nums text-muted-foreground/40"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-3 pt-2">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${item.className}`} aria-hidden />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </span>
        ))}
      </div>

      <div className="border-t border-border/60 px-4 pb-4 pt-3 dark:border-border-dark/60">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-text dark:text-text-dark">{selectedDayLabel}</h3>
          <span className="text-xs text-muted-foreground">{selectedWeekdayLabel}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <DayStatTile
            icon={Receipt}
            iconClassName="text-emerald-500 dark:text-emerald-400"
            value={formatCurrency(dayStats.expensesTotal)}
            label={`${dayStats.expensesCount} despesas`}
            toneClassName="border-emerald-500/30 bg-emerald-500/5"
          />
          <DayStatTile
            icon={CreditCard}
            iconClassName="text-teal-500 dark:text-teal-400"
            value={formatCurrency(dayStats.cardsTotal)}
            label={`${dayStats.cardsCount} cartões`}
            toneClassName="border-teal-500/30 bg-teal-500/5"
          />
          <DayStatTile
            icon={Layers}
            iconClassName="text-violet-500 dark:text-violet-400"
            value={formatCurrency(dayStats.installmentsTotal)}
            label={`${dayStats.installmentsCount} parcelas`}
            toneClassName="border-violet-500/30 bg-violet-500/5"
          />
          <DayStatTile
            icon={Undo2}
            iconClassName="text-rose-500 dark:text-rose-400"
            value={formatCurrency(dayStats.refundsTotal)}
            label={`${dayStats.refundsCount} estornos`}
            toneClassName="border-rose-500/30 bg-rose-500/5"
          />
        </div>

        <button
          type="button"
          onClick={onOpenDayDetails}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Ver todas as despesas do dia
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
