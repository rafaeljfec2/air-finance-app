import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DecisionAction } from '@/services/decisionEngineService';

import { humanizeImpactForDisplay } from '../humanizeImpactForDisplay';
import { formatActionReasonsPlain } from '../kpiPlainLabels';

export interface DecisionSecondaryActionsProps {
  readonly actions: readonly DecisionAction[];
}

export function DecisionSecondaryActions({ actions }: DecisionSecondaryActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <section id="decision-secondary" className="space-y-3" aria-label="Outros passos opcionais">
      <h2 className="text-lg font-semibold text-foreground">Outros passos</h2>
      <ul className="space-y-3">
        {actions.map((action, index) => {
          const reasonsPlain = formatActionReasonsPlain(action.reason);
          const impactLine = humanizeImpactForDisplay(action.impact);
          return (
            <li key={`${action.title}-${index}`}>
              <Card className="border-border/80 shadow-sm dark:border-border-dark/80">
                <CardHeader className="space-y-2 p-4 sm:p-5">
                  <CardTitle className="text-base font-semibold leading-snug">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {action.description}
                  </CardDescription>
                  {impactLine !== '' ? (
                    <p className="text-sm font-medium text-muted-foreground">{impactLine}</p>
                  ) : null}
                  {reasonsPlain !== '' ? (
                    <p className="truncate text-xs text-muted-foreground" title={reasonsPlain}>
                      {reasonsPlain}
                    </p>
                  ) : null}
                </CardHeader>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
