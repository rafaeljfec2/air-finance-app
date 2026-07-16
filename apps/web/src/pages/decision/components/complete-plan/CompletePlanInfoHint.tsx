import { HelpCircle } from 'lucide-react';

import { Tooltip } from '@/components/ui/tooltip';

export interface CompletePlanInfoHintProps {
  readonly content: string;
  readonly ariaLabel: string;
  readonly testId?: string;
}

/**
 * Hover/focus info hint for KPI explanations (compact, no dropdown chrome).
 */
export function CompletePlanInfoHint({ content, ariaLabel, testId }: CompletePlanInfoHintProps) {
  return (
    <Tooltip
      content={<span className="block max-w-[16rem] text-left leading-snug">{content}</span>}
      className="max-w-[18rem]"
    >
      <button
        type="button"
        data-testid={testId}
        aria-label={ariaLabel}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-400 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-gray-500 dark:hover:text-primary-400"
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden />
      </button>
    </Tooltip>
  );
}
