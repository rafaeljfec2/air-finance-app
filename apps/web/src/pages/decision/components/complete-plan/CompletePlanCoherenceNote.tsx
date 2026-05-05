import { Scale } from 'lucide-react';

import { COMPLETE_PLAN_LABELS } from './copy';

export interface CompletePlanCoherenceNoteProps {
  readonly text: string;
}

export function CompletePlanCoherenceNote({ text }: CompletePlanCoherenceNoteProps) {
  const trimmed = text.trim();
  if (trimmed === '') return null;

  return (
    <section
      aria-labelledby="cp-coherence-title"
      className="rounded-md border border-border bg-background px-4 py-4 shadow-sm ring-1 ring-inset ring-primary-500/10 dark:border-border-dark dark:bg-background-dark dark:ring-primary-400/15"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <Scale
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400"
          aria-hidden
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3
            id="cp-coherence-title"
            className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300"
          >
            {COMPLETE_PLAN_LABELS.coherenceTitle}
          </h3>
          <p className="text-sm leading-relaxed text-text dark:text-text-dark sm:text-base">
            {trimmed}
          </p>
        </div>
      </div>
    </section>
  );
}
