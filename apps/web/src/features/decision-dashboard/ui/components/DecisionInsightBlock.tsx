import { toMissionSupportLine } from '../helpers/missionCopy';
import { humanizeInsightCopy } from '../helpers/sanitizeInsightCopy';

interface DecisionInsightBlockProps {
  readonly message?: string;
  readonly rationale?: string;
}

/**
 * Benefit moment — calm consequence, never alarm.
 */
export function DecisionInsightBlock({ message, rationale }: DecisionInsightBlockProps) {
  const fromInsight = message ? humanizeInsightCopy(message) : '';
  const fromRationale = rationale ? toMissionSupportLine(rationale, 140) : '';
  const benefit =
    fromInsight.length > 0
      ? fromInsight
      : fromRationale.length > 0
        ? fromRationale
        : 'Isso abre um pouco mais de espaço e clareza para o que vem a seguir.';

  return (
    <div
      aria-label="Recommendation benefit"
      className="space-y-1.5 border-t border-border/60 pt-4 dark:border-border-dark/60"
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground">O que muda</p>
      <p className="text-sm text-text/90 dark:text-text-dark/90 leading-relaxed">{benefit}</p>
    </div>
  );
}
