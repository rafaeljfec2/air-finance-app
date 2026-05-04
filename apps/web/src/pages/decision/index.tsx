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

import { DecisionPrimaryBlock } from './components/DecisionPrimaryBlock';
import { DecisionSecondaryActions } from './components/DecisionSecondaryActions';
import { DecisionStatusStrip } from './components/DecisionStatusStrip';
import { problemHeadlineFromPrimaryIssue } from './primaryIssueLabels';

export function FinancialDecisionPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = useDecisionEngineEvaluateAuto(companyId);

  const displayActions = query.data?.actions ?? [];
  const primaryAction = displayActions[0];
  const secondaryActions = displayActions.slice(1);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['decision-engine', 'evaluate-auto', companyId],
    });
    setIsRefreshing(false);
  };

  const emptyCompany = companyId === '';
  const hasSecondaries = secondaryActions.length > 0;

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing || query.isFetching}>
        <div className="space-y-6 px-4 pb-8 pt-0 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/20">
                <Compass className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Decisão financeira
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Um passo de cada vez com seu dinheiro.
                </p>
              </div>
            </div>
            {!emptyCompany ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                className="min-h-[44px] shrink-0"
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
          </div>

          <div className="mx-auto w-full max-w-3xl space-y-6">
            {emptyCompany ? (
              <Card className="border-border dark:border-border-dark">
                <CardHeader>
                  <CardTitle className="text-lg">Escolha um perfil</CardTitle>
                  <CardDescription>
                    Selecione uma empresa no menu de perfis para carregar a decisão deste mês.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {!emptyCompany && query.isLoading ? (
              <Card className="border-border dark:border-border-dark">
                <CardHeader className="flex flex-col items-center gap-3 py-12">
                  <Spinner size="lg" className="text-primary-500" />
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Carregando…
                  </p>
                </CardHeader>
              </Card>
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
                <DecisionStatusStrip status={query.data.status} />
                {primaryAction !== undefined ? (
                  <DecisionPrimaryBlock
                    action={primaryAction}
                    status={query.data.status}
                    hasSecondarySteps={hasSecondaries}
                    problemHeadline={problemHeadlineFromPrimaryIssue(query.data.primary_issue)}
                  />
                ) : (
                  <p className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
                    Nada priorizado neste mês.
                  </p>
                )}
                <DecisionSecondaryActions actions={secondaryActions} />
              </div>
            ) : null}
          </div>
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
