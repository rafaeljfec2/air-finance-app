import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { cn } from '@/lib/utils';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';

interface TimelineDesktopHeaderProps {
  readonly startDate: string;
  readonly setStartDate: (value: string) => void;
  readonly endDate: string;
  readonly setEndDate: (value: string) => void;
  readonly currentBalance: number | null;
  readonly onPreviousPeriod: () => void;
  readonly onNextPeriod: () => void;
  readonly onNewTransaction: () => void;
}

function formatPeriodLabel(startDate: string, endDate: string): string {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end) {
    return `${startDate} – ${endDate}`;
  }

  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  const endLabel = end.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (sameMonth) {
    const startDay = start.toLocaleDateString('pt-BR', { day: '2-digit' });
    return `${startDay} a ${endLabel}`;
  }

  const startLabel = start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${startLabel} – ${endLabel}`;
}

export function TimelineDesktopHeader({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  currentBalance,
  onPreviousPeriod,
  onNextPeriod,
  onNewTransaction,
}: Readonly<TimelineDesktopHeaderProps>) {
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);

  const handleDateRangeApply = useCallback(
    (start: Date | undefined, end: Date | undefined) => {
      setStartDate(start ? formatDateToLocalISO(start) : '');
      setEndDate(end ? formatDateToLocalISO(end) : '');
      setIsDateRangePickerOpen(false);
    },
    [setStartDate, setEndDate],
  );

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 dark:border-border-dark lg:px-6">
      <div className="min-w-0">
        <h1 className="text-lg font-bold leading-tight text-text dark:text-text-dark">
          Movimentos Financeiros
        </h1>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">
          A história do seu dinheiro, em ordem cronológica.
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        {currentBalance !== null ? (
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
              Saldo atual
            </p>
            <p
              className={cn(
                'text-base font-bold leading-tight tabular-nums',
                currentBalance >= 0 ? 'text-green-500' : 'text-red-500',
              )}
            >
              {formatCurrency(currentBalance)}
            </p>
          </div>
        ) : null}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPreviousPeriod}
            className="rounded-lg border border-border p-1.5 transition-colors hover:bg-background dark:border-border-dark dark:hover:bg-background-dark"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
          </button>

          <DateRangePicker
            open={isDateRangePickerOpen}
            onClose={() => setIsDateRangePickerOpen(false)}
            startDate={startDate}
            endDate={endDate}
            onApply={handleDateRangeApply}
            trigger={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDateRangePickerOpen((open) => !open)}
                className="h-9 gap-2 border-border bg-card px-3 text-xs font-semibold dark:border-border-dark dark:bg-card-dark"
              >
                <Calendar className="h-3.5 w-3.5" />
                {formatPeriodLabel(startDate, endDate)}
                <ChevronDown className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
              </Button>
            }
            position="bottom"
          />

          <button
            type="button"
            onClick={onNextPeriod}
            className="rounded-lg border border-border p-1.5 transition-colors hover:bg-background dark:border-border-dark dark:hover:bg-background-dark"
            aria-label="Próximo período"
          >
            <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
          </button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-border bg-card px-3 text-xs dark:border-border-dark dark:bg-card-dark"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onNewTransaction}
          className="h-9 gap-2 bg-primary-500 px-3 text-xs font-semibold text-white hover:bg-primary-600"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova transação
        </Button>
      </div>
    </header>
  );
}
