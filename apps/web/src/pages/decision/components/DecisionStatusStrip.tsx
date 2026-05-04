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
}

export function DecisionStatusStrip({ status }: DecisionStatusStripProps) {
  const row = STATUS_COPY[status];

  return (
    <Card className={cn('shadow-sm', row.cardAccent)}>
      <CardHeader className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6">
        <Badge variant={row.badgeVariant} className={cn('w-fit', row.badgeClassName)}>
          {row.label}
        </Badge>
        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground sm:text-right">
          {row.line}
        </p>
      </CardHeader>
    </Card>
  );
}
