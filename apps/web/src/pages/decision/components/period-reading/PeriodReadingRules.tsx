import { CalendarCheck, CalendarClock, FileText, Percent, Wallet } from 'lucide-react';

import type { CompletePlanRule } from '@/services/completePlanService';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface RulePalette {
  readonly icon: typeof FileText;
  readonly square: string;
}

const RULE_PALETTES: readonly RulePalette[] = [
  { icon: FileText, square: 'bg-rose-500/15 text-rose-400' },
  { icon: Wallet, square: 'bg-amber-500/15 text-amber-400' },
  { icon: CalendarCheck, square: 'bg-emerald-500/15 text-emerald-400' },
  { icon: Percent, square: 'bg-rose-500/15 text-rose-400' },
  { icon: CalendarClock, square: 'bg-blue-500/15 text-blue-400' },
];

interface PeriodReadingRulesProps {
  readonly rules: readonly CompletePlanRule[];
  readonly simpleRule: string;
}

export function PeriodReadingRules({ rules, simpleRule }: Readonly<PeriodReadingRulesProps>) {
  const items =
    rules.length > 0
      ? rules
      : simpleRule.trim() !== ''
        ? [{ id: 'simple', text: simpleRule, rationale: '' }]
        : [];

  return (
    <section
      aria-label="Regras para esta fase"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader number={7} title="Regras para esta fase" />
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem regras pessoais neste período.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {items.slice(0, 5).map((rule, index) => {
            const palette = RULE_PALETTES[index % RULE_PALETTES.length];
            const Icon = palette.icon;
            return (
              <article
                key={rule.id}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-background px-4 py-4 dark:border-border-dark/70 dark:bg-background-dark"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${palette.square}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text dark:text-text-dark">{rule.text}</p>
                  {rule.rationale.trim() !== '' ? (
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">
                      {rule.rationale}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
