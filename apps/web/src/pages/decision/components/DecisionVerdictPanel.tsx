import type { DecisionEngineStatus, ThemePhase } from '@/services/decisionEngineService';

import { displayOrderingRationaleForUser } from '../utils/displayOrderingRationaleForUser';
import {
  summarizeIssueDriversForVerdict,
  type IssueDriverWire,
} from '../utils/formatIssueDriversForVerdict';

export interface DecisionVerdictPanelProps {
  readonly status: DecisionEngineStatus;
  readonly themePhase: ThemePhase | null | undefined;
  readonly orderingRationale: string;
  readonly primaryIssue: string;
  readonly issueDrivers: readonly IssueDriverWire[];
}

function verdictHeadline(
  status: DecisionEngineStatus,
  themePhase: ThemePhase | null | undefined,
): string {
  if (status === 'critical') {
    return 'Veredito: ação urgente.';
  }
  if (status === 'healthy') {
    return 'Veredito: manter o que funciona — sem ação obrigatória agora.';
  }
  const phaseHint =
    themePhase === 'red'
      ? ' (fase: pare de piorar)'
      : themePhase === 'yellow'
        ? ' (fase: voltar a respirar)'
        : themePhase === 'green'
          ? ' (fase: no verde)'
          : '';
  return `Veredito: atenção — ajustar com calma.${phaseHint}`;
}

export function DecisionVerdictPanel({
  status,
  themePhase,
  orderingRationale,
  primaryIssue,
  issueDrivers,
}: DecisionVerdictPanelProps) {
  const rationale = displayOrderingRationaleForUser(orderingRationale, primaryIssue).trim();
  const metricsLine = summarizeIssueDriversForVerdict(issueDrivers).trim();
  return (
    <div className="rounded-md border border-border bg-card px-3 py-3 dark:border-border-dark dark:bg-card-dark">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {verdictHeadline(status, themePhase)}
      </p>
      {rationale !== '' ? (
        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
          {rationale}
        </p>
      ) : null}
      {metricsLine !== '' ? (
        <p
          data-testid="verdict-metrics-line"
          className="mt-2 text-xs leading-snug text-muted-foreground sm:text-sm"
        >
          {metricsLine}
        </p>
      ) : null}
    </div>
  );
}
