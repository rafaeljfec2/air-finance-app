import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
}: DecisionReferencePeriodSelectorProps) {
  const years = yearOptions(minYear, maxYear);

  return (
    <section
      aria-label="Período de referência"
      className="w-full rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card"
    >
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-foreground dark:text-foreground">Referência</h2>
        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
          Use o mês atual para o comportamento padrão da API. Outro mês envia o filtro na análise
          automática.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1.5">
            <label
              className="text-xs font-medium text-foreground dark:text-foreground"
              htmlFor="decision-ref-month"
            >
              Mês
            </label>
            <Select
              value={String(month1To12)}
              onValueChange={(v) => {
                onMonthChange(Number.parseInt(v, 10));
              }}
            >
              <SelectTrigger
                id="decision-ref-month"
                className="dark:border-border-dark dark:bg-background"
                aria-label="Mês de referência"
              >
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
            <label
              className="text-xs font-medium text-foreground dark:text-foreground"
              htmlFor="decision-ref-year"
            >
              Ano
            </label>
            <Select
              value={String(year)}
              onValueChange={(v) => {
                onYearChange(Number.parseInt(v, 10));
              }}
            >
              <SelectTrigger
                id="decision-ref-year"
                className="dark:border-border-dark dark:bg-background"
                aria-label="Ano de referência"
              >
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
