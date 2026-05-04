import { Lightbulb } from 'lucide-react';

import { COMPLETE_PLAN_LABELS } from './copy';

export interface CompletePlanDiagnosisProps {
  readonly text: string;
}

export function CompletePlanDiagnosis({ text }: CompletePlanDiagnosisProps) {
  return (
    <section
      aria-labelledby="cp-diagnosis-title"
      className="rounded-md border border-border bg-primary-50/50 px-4 py-4 dark:border-border-dark dark:bg-primary-900/20"
    >
      <div className="flex items-start gap-3">
        <Lightbulb
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-500 dark:text-primary-400"
          aria-hidden
        />
        <div className="space-y-1">
          <h3
            id="cp-diagnosis-title"
            className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            {COMPLETE_PLAN_LABELS.diagnosisTitle}
          </h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-text dark:text-text-dark sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
