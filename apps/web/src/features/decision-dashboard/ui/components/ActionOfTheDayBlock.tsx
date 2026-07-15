import type { ReactNode } from 'react';

import { buildCompanionCtaLabel } from '../helpers/missionCopy';

interface ActionOfTheDayBlockProps {
  readonly label: string;
  readonly rationale: string;
  readonly ctaLabel?: string;
  readonly benefitSlot?: ReactNode;
  readonly inactionSlot?: ReactNode;
}

export function ActionOfTheDayBlock({
  label,
  ctaLabel,
  benefitSlot,
  inactionSlot,
}: ActionOfTheDayBlockProps) {
  const commitment = ctaLabel ?? buildCompanionCtaLabel(label);

  return (
    <section
      aria-label="Action of the day"
      className="space-y-4 rounded-xl border border-border/70 bg-muted/20 px-3.5 py-4 dark:border-border-dark/70 dark:bg-muted/10 sm:px-4 sm:py-5"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Decisão de hoje
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          Se eu estivesse no seu lugar, começaria por aqui — um passo de cada vez:
        </p>
        <h2 className="text-lg sm:text-xl font-semibold text-text dark:text-text-dark leading-snug tracking-tight text-balance">
          {label}
        </h2>
      </div>
      <p
        aria-label="Today's commitment"
        className="rounded-xl border border-primary-500/25 bg-primary-500/10 px-4 py-3 text-sm font-medium text-primary-700 dark:border-primary-400/30 dark:bg-primary-500/15 dark:text-primary-300 leading-snug"
      >
        {commitment}
      </p>
      {benefitSlot}
      {inactionSlot}
    </section>
  );
}
