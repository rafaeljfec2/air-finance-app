import { Link as RouterLink } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type { DecisionAction, DecisionEngineStatus } from '@/services/decisionEngineService';

import { decisionQuickLinksForIssue } from '../decisionQuickLinks';
import { humanizeImpactForDisplay } from '../humanizeImpactForDisplay';
import { formatActionReasonsPlain } from '../kpiPlainLabels';

export interface DecisionPrimaryBlockProps {
  readonly action: DecisionAction;
  readonly status: DecisionEngineStatus;
  readonly hasSecondarySteps: boolean;
  readonly problemHeadline: string;
  readonly primaryIssue: string;
  /** When false, hides the context line (e.g. when the parent already shows the same headline). */
  readonly showProblemContext?: boolean;
}

const CARD_ACCENT: Readonly<Record<DecisionEngineStatus, string>> = {
  critical: 'border-l-4 border-l-border dark:border-l-border-dark',
  attention: 'border-l-4 border-l-amber-500/70',
  healthy: 'border-l-4 border-l-primary-500',
};

function isHygieneIssue(primaryIssue: string): boolean {
  return primaryIssue === 'data_incomplete';
}

export function DecisionPrimaryBlock({
  action,
  status,
  hasSecondarySteps,
  problemHeadline,
  primaryIssue,
  showProblemContext = true,
}: DecisionPrimaryBlockProps) {
  const hygiene = isHygieneIssue(primaryIssue);
  const reasonsPlain = formatActionReasonsPlain(action.reason);
  const impactDisplay = humanizeImpactForDisplay(action.impact);
  const quickLinks = decisionQuickLinksForIssue(primaryIssue);

  const handleConfirmPriority = async (): Promise<void> => {
    const text = `${action.title}\n${action.description}\n${impactDisplay}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(
        hygiene
          ? 'Atalho copiado. Complete os dados para habilitar a leitura.'
          : 'Passo do período copiado. A decisão de hoje continua na Home.',
      );
    } catch {
      toast.info(hygiene ? 'Complete os dados pelos atalhos abaixo.' : 'Detalhe no cartão acima.');
    }
  };

  return (
    <Card
      className={cn(
        'shadow-sm',
        hygiene ? 'ring-1 ring-border/60 dark:ring-border-dark/60' : 'ring-1 ring-border/80',
        CARD_ACCENT[status],
      )}
    >
      <CardHeader className="space-y-3 p-4 sm:p-5">
        {showProblemContext ? (
          <p id="decision-context" className="text-center text-sm text-muted-foreground">
            {problemHeadline}
          </p>
        ) : null}
        <div className="flex justify-center">
          <span className="inline-flex rounded-full bg-muted/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:bg-muted/20">
            {hygiene ? 'Para habilitar a leitura' : 'Higiene do período'}
          </span>
        </div>
        <CardTitle className="text-center text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
          {action.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed sm:text-base">
          {action.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-2 pt-0 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {hygiene ? 'Por quê' : 'Impacto no período'}
        </p>
        <p className="text-sm font-medium text-foreground sm:text-base">{impactDisplay}</p>
        {reasonsPlain !== '' ? (
          <p className="truncate text-xs text-muted-foreground" title={reasonsPlain}>
            Levamos em conta: {reasonsPlain}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-4 pt-2 sm:p-5 sm:pt-0">
        <Button
          type="button"
          variant={hygiene ? 'outline' : 'default'}
          size="lg"
          className="min-h-[44px] w-full"
          onClick={() => void handleConfirmPriority()}
        >
          {hygiene
            ? 'Copiar lembrete de cadastro'
            : hasSecondarySteps
              ? 'Copiar passo do período'
              : 'Copiar passo do período'}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Isto não substitui a decisão de hoje na{' '}
          <RouterLink
            to="/home"
            className="font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
          >
            Home
          </RouterLink>
          .
        </p>
        <nav
          aria-label="Atalhos relacionados"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm"
        >
          {quickLinks.map((quickLink) => (
            <RouterLink
              key={quickLink.href}
              to={quickLink.href}
              className="min-h-[44px] min-w-[44px] content-center text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
            >
              {quickLink.label}
            </RouterLink>
          ))}
        </nav>
      </CardFooter>
    </Card>
  );
}
