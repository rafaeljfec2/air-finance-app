import { toMissionSupportLine } from '../helpers/missionCopy';
import { humanizeInsightCopy } from '../helpers/sanitizeInsightCopy';

interface DecisionInsightBlockProps {
  readonly message?: string;
  readonly rationale?: string;
}

/**
 * Benefit moment — sits inside the recommendation surface.
 */
export function DecisionInsightBlock({ message, rationale }: DecisionInsightBlockProps) {
  const fromInsight = message ? humanizeInsightCopy(message) : '';
  const fromRationale = rationale ? toMissionSupportLine(rationale, 140) : '';
  const benefit =
    fromInsight.length > 0
      ? fromInsight
      : fromRationale.length > 0
        ? fromRationale
        : 'Isso melhora sua margem de tranquilidade para o que vem a seguir.';

  return (
    <div
      aria-label="Recommendation benefit"
      className="space-y-1 border-t border-primary-200/40 pt-3 dark:border-primary-700/30"
    >
      <p className="text-xs font-medium text-muted-foreground">O que muda se você fizer isso</p>
      <p className="text-sm text-text dark:text-text-dark leading-snug">{benefit}</p>
    </div>
  );
}
