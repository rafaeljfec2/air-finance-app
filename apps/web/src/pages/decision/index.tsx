import { useQueryClient } from '@tanstack/react-query';
import { Compass, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { Spinner } from '@/components/ui/spinner';
import { useDecisionEngineEvaluateAuto } from '@/hooks/useDecisionEngineEvaluateAuto';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';

import { DecisionActionsList } from './components/DecisionActionsList';
import { DecisionStatusHero } from './components/DecisionStatusHero';
import { formatPrimaryIssueLabel } from './primaryIssueLabels';

export function FinancialDecisionPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = useDecisionEngineEvaluateAuto(companyId);

  const displayActions = query.data?.actions ?? [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['decision-engine', 'evaluate-auto', companyId],
    });
    setIsRefreshing(false);
  };

  const emptyCompany = companyId === '';

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing || query.isFetching}>
        <div className="space-y-6 px-4 pb-8 pt-2 sm:px-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <Compass className="h-6 w-6 text-primary dark:text-primary-400" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
                  Decisão financeira
                </h1>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Uma leitura simples do mês: o que importa agora e até três próximos passos.
                </p>
              </div>
            </div>
            {!emptyCompany ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                className="min-h-[44px] shrink-0 self-start sm:self-center"
                onClick={() => void query.refetch()}
                disabled={query.isFetching}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`}
                  aria-hidden
                />
                Atualizar
              </Button>
            ) : null}
          </header>

          {emptyCompany ? (
            <Card className="border-border dark:border-border-dark">
              <CardHeader>
                <CardTitle className="text-lg">Escolha um perfil</CardTitle>
                <CardDescription>
                  Selecione uma empresa no menu de perfis para carregar a decisão deste mês. Nada é
                  calculado aqui no app: o resultado vem do servidor.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {!emptyCompany && query.isLoading ? (
            <div
              className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark"
              role="status"
              aria-live="polite"
            >
              <Spinner size="lg" className="text-primary" />
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Carregando decisão do mês…
              </p>
            </div>
          ) : null}

          {!emptyCompany && query.isError ? (
            <Card className="border-destructive/50 bg-destructive/5 dark:border-destructive/40">
              <CardHeader>
                <CardTitle className="text-lg text-destructive dark:text-destructive">
                  Não foi possível carregar
                </CardTitle>
                <CardDescription className="text-destructive/90 dark:text-destructive/90">
                  {query.error instanceof Error
                    ? query.error.message
                    : 'Tente novamente em instantes.'}
                </CardDescription>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 min-h-[44px] w-full sm:w-auto"
                  onClick={() => void query.refetch()}
                >
                  Tentar de novo
                </Button>
              </CardHeader>
            </Card>
          ) : null}

          {!emptyCompany && query.isSuccess && query.data ? (
            <div className="space-y-6">
              <DecisionStatusHero
                status={query.data.status}
                primaryIssueLabel={formatPrimaryIssueLabel(query.data.primary_issue)}
                orderingRationale={query.data.ordering_rationale}
              />
              <DecisionActionsList actions={displayActions} />
              {query.data.ruleEngineVersion !== undefined && query.data.ruleEngineVersion !== '' ? (
                <p className="text-center text-xs text-muted-foreground dark:text-muted-foreground">
                  Motor v{query.data.ruleEngineVersion}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
