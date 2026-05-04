import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DecisionAction } from '@/services/decisionEngineService';

export interface DecisionActionsListProps {
  readonly actions: readonly DecisionAction[];
}

export function DecisionActionsList({ actions }: DecisionActionsListProps) {
  if (actions.length === 0) {
    return (
      <Card className="border-dashed border-border dark:border-border-dark">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Próximos passos</CardTitle>
          <CardDescription>
            Nenhuma ação priorizada neste momento. Os dados do mês podem estar completos ou estáveis
            segundo as regras do motor.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-foreground dark:text-foreground">
        Próximos passos
      </h2>
      <ul className="space-y-3" aria-label="Lista de ações sugeridas">
        {actions.map((action, index) => {
          const isPrimary = index === 0;
          return (
            <li key={`${action.title}-${index}`}>
              <Card
                className={cn(
                  isPrimary &&
                    'ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-offset-background dark:ring-primary-400',
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isPrimary ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                        Comece por aqui
                      </span>
                    ) : null}
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  <CardDescription className="text-foreground/80 dark:text-foreground/80">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground dark:text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground dark:text-foreground">
                      Impacto:{' '}
                    </span>
                    {action.impact}
                  </p>
                  {action.reason.length > 0 ? (
                    <p className="text-xs">
                      <span className="font-medium text-foreground dark:text-foreground">
                        Sinais:{' '}
                      </span>
                      {action.reason.join(', ')}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
