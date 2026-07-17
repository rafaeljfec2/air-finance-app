import { CalendarDays, ChevronDown } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { formatPeriodRangeLabel } from '../utils/formatPeriodRangeLabel';

const MONTH_LABELS_PT: readonly string[] = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export interface DecisionPeriodDropdownProps {
  readonly year: number;
  /** 1–12 */
  readonly month1To12: number;
  readonly onYearChange: (year: number) => void;
  readonly onMonthChange: (month1To12: number) => void;
  readonly minYear: number;
  readonly maxYear: number;
  /** When true, the selected period is not the current month. */
  readonly isNonCurrentPeriod: boolean;
}

function yearOptions(minYear: number, maxYear: number): number[] {
  const out: number[] = [];
  for (let y = minYear; y <= maxYear; y += 1) {
    out.push(y);
  }
  return out;
}

export function DecisionPeriodDropdown({
  year,
  month1To12,
  onYearChange,
  onMonthChange,
  minYear,
  maxYear,
  isNonCurrentPeriod,
}: DecisionPeriodDropdownProps) {
  const label = formatPeriodRangeLabel(year, month1To12);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Período em análise: ${label}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-muted/50 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="whitespace-nowrap">{label}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="decision-period-month">
            Mês
          </label>
          <Select
            value={String(month1To12)}
            onValueChange={(v) => {
              onMonthChange(Number.parseInt(v, 10));
            }}
          >
            <SelectTrigger id="decision-period-month" aria-label="Mês de referência">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {MONTH_LABELS_PT.map((monthLabel, idx) => {
                const m = idx + 1;
                return (
                  <SelectItem key={m} value={String(m)}>
                    {monthLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="decision-period-year">
            Ano
          </label>
          <Select
            value={String(year)}
            onValueChange={(v) => {
              onYearChange(Number.parseInt(v, 10));
            }}
          >
            <SelectTrigger id="decision-period-year" aria-label="Ano de referência">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions(minYear, maxYear).map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isNonCurrentPeriod ? (
          <p role="status" className="text-xs leading-snug text-muted-foreground">
            Outro período = outra leitura. Padrão é o mês atual.
          </p>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
