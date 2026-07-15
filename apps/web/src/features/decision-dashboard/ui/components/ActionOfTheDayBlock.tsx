import { Button } from '@/components/ui/button';

import { buildCompanionCtaLabel } from '../helpers/missionCopy';

interface ActionOfTheDayBlockProps {
  readonly label: string;
  readonly rationale: string;
}

export function ActionOfTheDayBlock({ label }: ActionOfTheDayBlockProps) {
  const ctaLabel = buildCompanionCtaLabel(label);

  return (
    <section aria-label="Action of the day" className="space-y-3 max-w-xl">
      <p className="text-sm text-primary-600 dark:text-primary-400">
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
    </section>
  );
}
