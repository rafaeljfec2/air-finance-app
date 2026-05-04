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

import { humanizeImpactForDisplay } from '../humanizeImpactForDisplay';
import { formatActionReasonsPlain } from '../kpiPlainLabels';

export interface DecisionPrimaryBlockProps {
  readonly action: DecisionAction;
  readonly status: DecisionEngineStatus;
  readonly hasSecondarySteps: boolean;
  readonly problemHeadline: string;
}

const CARD_ACCENT: Readonly<Record<DecisionEngineStatus, string>> = {
  critical: 'border-l-4 border-l-red-500',
  attention: 'border-l-4 border-l-amber-500',
  healthy: 'border-l-4 border-l-primary-500',
};

export function DecisionPrimaryBlock({
  action,
  status,
  hasSecondarySteps,
  problemHeadline,
}: DecisionPrimaryBlockProps) {
  const reasonsPlain = formatActionReasonsPlain(action.reason);
  const impactDisplay = humanizeImpactForDisplay(action.impact);

  const handleConfirmPriority = async (): Promise<void> => {
    const text = `${action.title}\n${action.description}\n${impactDisplay}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Passo copiado. Cole onde você organiza o mês.');
    } catch {
      toast.info('Seu passo prioritário está no cartão acima.');
    }
  };

  return (
    <Card className={cn('shadow-sm', CARD_ACCENT[status])}>
      <CardHeader className="space-y-3 p-4 sm:p-6">
        <p
          id="decision-context"
          className="text-center text-sm text-muted-foreground dark:text-muted-foreground"
        >
          {problemHeadline}
        </p>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
          Próximo passo
        </p>
        <CardTitle className="text-xl leading-tight sm:text-2xl">{action.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {action.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-2 pt-0 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Impacto
        </p>
        <p className="text-sm font-medium text-foreground dark:text-foreground sm:text-base">
          {impactDisplay}
        </p>
        {reasonsPlain !== '' ? (
          <p
            className="truncate text-xs text-muted-foreground dark:text-muted-foreground"
            title={reasonsPlain}
          >
            Levamos em conta: {reasonsPlain}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-2 sm:p-6 sm:pt-0">
        <Button
          type="button"
          variant="default"
          size="lg"
          className="min-h-[44px] w-full"
          onClick={() => void handleConfirmPriority()}
        >
          {hasSecondarySteps ? 'Vou começar por aqui' : 'Começar agora'}
        </Button>
      </CardFooter>
    </Card>
  );
}
