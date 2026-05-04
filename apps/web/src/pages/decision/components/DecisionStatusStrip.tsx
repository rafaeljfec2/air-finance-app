import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DecisionEngineStatus } from '@/services/decisionEngineService';

const STATUS_COPY: Readonly<
  Record<
    DecisionEngineStatus,
    {
      readonly label: string;
      readonly line: string;
      readonly badgeVariant: 'destructive' | 'outline' | 'success';
      readonly badgeClassName?: string;
      readonly cardAccent: string;
    }
  >
> = {
  healthy: {
    label: 'Saudável',
    line: 'Continue no bom caminho.',
    badgeVariant: 'success',
    cardAccent: 'border-l-4 border-l-primary-500',
  },
  attention: {
    label: 'Atenção',
    line: 'Vale ajustar algo neste mês.',
    badgeVariant: 'outline',
    badgeClassName:
      'border-amber-500/60 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950/60',
    cardAccent: 'border-l-4 border-l-amber-500',
  },
  critical: {
    label: 'Crítico',
    line: 'Você precisa agir hoje.',
    badgeVariant: 'destructive',
    cardAccent: 'border-l-4 border-l-red-500',
  },
};

export interface DecisionStatusStripProps {
  readonly status: DecisionEngineStatus;
  /** When set, replaces the generic status line (e.g. problem headline from the engine). */
  readonly briefingLine?: string;
}

export function DecisionStatusStrip({ status, briefingLine }: DecisionStatusStripProps) {
  const row = STATUS_COPY[status];
  const message =
    briefingLine !== undefined && briefingLine.trim() !== '' ? briefingLine : row.line;

  return (
    <Card className={cn('shadow-sm', row.cardAccent)}>
      <CardHeader className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-6">
        <Badge variant={row.badgeVariant} className={cn('w-fit shrink-0', row.badgeClassName)}>
          {row.label}
        </Badge>
        <p
          className={cn(
            'min-w-0 flex-1 text-pretty sm:text-right',
            briefingLine !== undefined && briefingLine.trim() !== ''
              ? 'text-base font-medium leading-snug text-foreground sm:text-left'
              : 'text-sm font-medium text-muted-foreground',
          )}
        >
          {message}
        </p>
      </CardHeader>
    </Card>
  );
}
