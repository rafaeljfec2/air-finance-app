import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import { buildCompanionCtaLabel } from '../helpers/missionCopy';

interface ActionOfTheDayBlockProps {
  readonly label: string;
  readonly rationale: string;
  readonly benefitSlot?: ReactNode;
}

export function ActionOfTheDayBlock({ label, benefitSlot }: ActionOfTheDayBlockProps) {
  const ctaLabel = buildCompanionCtaLabel(label);

  return (
    <section
      aria-label="Action of the day"
      className="space-y-3 rounded-xl border border-primary-200/50 bg-primary-50/60 px-4 py-4 dark:border-primary-700/40 dark:bg-primary-900/20 sm:px-5 sm:py-5"
    >
      <p className="text-sm text-primary-700 dark:text-primary-300">
        Se eu estivesse no seu lugar, começaria por aqui:
      </p>
      <h2 className="text-lg sm:text-xl font-semibold text-text dark:text-text-dark leading-snug tracking-tight">
        {label}
      </h2>
      <Button
        type="button"
        size="md"
        className="min-h-11 px-5 shadow-sm bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-500 dark:hover:bg-primary-400"
      >
        {ctaLabel}
      </Button>
      {benefitSlot}
    </section>
  );
}
