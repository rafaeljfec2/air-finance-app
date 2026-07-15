import { toMissionSupportLine } from '../helpers/missionCopy';
import { humanizeInsightCopy } from '../helpers/sanitizeInsightCopy';

interface DecisionInsightBlockProps {
  readonly message?: string;
  readonly rationale?: string;
}

/**
 * Benefit moment of the parecer — "What changes if I do this?"
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
    <section aria-label="Recommendation benefit" className="space-y-1.5 max-w-xl">
      <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
        O que muda se você fizer isso
      </p>
      <p className="text-sm text-muted-foreground leading-snug">{benefit}</p>
    </section>
  );
}
