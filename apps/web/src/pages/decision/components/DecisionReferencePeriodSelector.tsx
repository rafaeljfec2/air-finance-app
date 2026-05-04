import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

export interface DecisionReferencePeriodSelectorProps {
  readonly year: number;
  /** 1–12 */
  readonly month1To12: number;
  readonly onYearChange: (year: number) => void;
  readonly onMonthChange: (month1To12: number) => void;
  readonly minYear: number;
  readonly maxYear: number;
  /** `inline`: barra compacta sob o cabeçalho (desktop em linha). */
  readonly layout?: 'default' | 'inline';
}

function yearOptions(minYear: number, maxYear: number): number[] {
  const out: number[] = [];
  for (let y = minYear; y <= maxYear; y += 1) {
    out.push(y);
  }
  return out;
}

export function DecisionReferencePeriodSelector({
  year,
  month1To12,
  onYearChange,
  onMonthChange,
  minYear,
  maxYear,
  layout = 'default',
}: DecisionReferencePeriodSelectorProps) {
  const years = yearOptions(minYear, maxYear);
  const inline = layout === 'inline';

  return (
    <section
      aria-label="Período de referência"
      className={cn(
        'w-full rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark',
        inline ? 'p-3 sm:p-4' : 'rounded-lg p-4',
      )}
    >
      <div
        className={cn(
          inline
            ? 'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4'
            : 'space-y-2',
        )}
      >
        <div className={cn(inline ? 'min-w-0 shrink-0 sm:max-w-[11rem]' : '')}>
          <h2 className="text-sm font-medium text-foreground">
            {inline ? 'Período' : 'Referência'}
          </h2>
          <p
            className={cn(
              'text-muted-foreground',
              inline ? 'mt-1 text-xs leading-snug sm:max-w-[14rem]' : 'text-xs',
            )}
          >
            {inline
              ? 'Padrão = mês atual (API). Outro mês aplica filtro explícito.'
              : 'Use o mês atual para o comportamento padrão da API. Outro mês envia o filtro na análise automática.'}
          </p>
        </div>
        <div
          className={cn(
            'flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-3',
            inline && 'sm:flex-1',
          )}
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="decision-ref-month">
              Mês
            </label>
            <Select
              value={String(month1To12)}
              onValueChange={(v) => {
                onMonthChange(Number.parseInt(v, 10));
              }}
            >
              <SelectTrigger id="decision-ref-month" aria-label="Mês de referência">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_LABELS_PT.map((label, idx) => {
                  const m = idx + 1;
                  return (
                    <SelectItem key={m} value={String(m)}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="decision-ref-year">
              Ano
            </label>
            <Select
              value={String(year)}
              onValueChange={(v) => {
                onYearChange(Number.parseInt(v, 10));
              }}
            >
              <SelectTrigger id="decision-ref-year" aria-label="Ano de referência">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
