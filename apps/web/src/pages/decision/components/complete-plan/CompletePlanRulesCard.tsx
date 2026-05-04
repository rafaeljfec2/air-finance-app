import { Compass, ListChecks } from 'lucide-react';

import type { CompletePlanResponse } from '@/services/completePlanService';

import { COMPLETE_PLAN_LABELS } from './copy';

export interface CompletePlanRulesCardProps {
  readonly rules: CompletePlanResponse['personalRules'];
  readonly simpleRule: string;
}

export function CompletePlanRulesCard({ rules, simpleRule }: CompletePlanRulesCardProps) {
  return (
    <section
      aria-labelledby="cp-rules-title"
      className="space-y-4 rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />
        <h3
          id="cp-rules-title"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          {COMPLETE_PLAN_LABELS.rulesTitle}
        </h3>
      </div>
      <ul className="space-y-2">
        {rules.map((rule) => (
          <li key={rule.id} className="rounded-md bg-card px-3 py-3 dark:bg-card-dark">
            <p className="text-sm font-medium text-text dark:text-text-dark">{rule.text}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{rule.rationale}</p>
          </li>
        ))}
      </ul>

      <div className="flex items-start gap-3 rounded-md border border-primary-500/40 bg-primary-50 px-3 py-3 dark:border-primary-400/40 dark:bg-primary-900/30">
        <Compass
          className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300"
          aria-hidden
        />
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
            {COMPLETE_PLAN_LABELS.simpleRuleTitle}
          </p>
          <p className="text-sm font-semibold text-text dark:text-text-dark">{simpleRule}</p>
        </div>
      </div>
    </section>
  );
}
