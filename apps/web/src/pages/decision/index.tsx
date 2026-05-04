import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { Spinner } from '@/components/ui/spinner';
import { useDecisionEngineEvaluateAuto } from '@/hooks/useDecisionEngineEvaluateAuto';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';

import { DecisionCompletePlanSection } from './components/complete-plan/DecisionCompletePlanSection';
import { DecisionPageToolbar } from './components/DecisionPageToolbar';
import { DecisionPlaybookCard } from './components/DecisionPlaybookCard';
import { DecisionPrimaryBlock } from './components/DecisionPrimaryBlock';
import { DecisionReferencePeriodSelector } from './components/DecisionReferencePeriodSelector';
import { DecisionSecondaryActions } from './components/DecisionSecondaryActions';
import { DecisionStatusStrip } from './components/DecisionStatusStrip';
import { getPlaybook } from './playbooks';
import { problemHeadlineFromPrimaryIssue } from './primaryIssueLabels';
import { resolveEvaluateAutoReferencePeriod } from './utils/referencePeriod';

const motionContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const motionItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FinancialDecisionPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const maxYear = new Date().getFullYear();
  const minYear = maxYear - 4;

  const [refYear, setRefYear] = useState(() => new Date().getFullYear());
  const [refMonth, setRefMonth] = useState(() => new Date().getMonth() + 1);

  const referencePeriod = resolveEvaluateAutoReferencePeriod(refYear, refMonth);

  const query = useDecisionEngineEvaluateAuto(companyId, {
    referencePeriod,
  });

  const displayActions = query.data?.actions ?? [];
  const primaryAction = displayActions[0];
  const secondaryActions = displayActions.slice(1);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['decision-engine'],
    });
    setIsRefreshing(false);
  };

  const emptyCompany = companyId === '';
  const hasSecondaries = secondaryActions.length > 0;

  const toolbarSubtitle = emptyCompany
    ? 'Escolha um perfil para ver a leitura do período e o que fazer a seguir.'
    : 'Leitura do período, estado geral e próximo passo — em sequência, sem ruído visual.';

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing || query.isFetching}>
        <motion.div
          variants={motionContainer}
          initial="hidden"
          animate="show"
          className="space-y-6 px-4 pb-8 pt-0 sm:px-6"
        >
          <motion.div variants={motionItem}>
            <DecisionPageToolbar
              title="Decisão financeira"
              subtitle={toolbarSubtitle}
              showRefresh={!emptyCompany}
              isFetching={query.isFetching}
              onRefresh={() => void query.refetch()}
            >
              {!emptyCompany ? (
                <DecisionReferencePeriodSelector
                  layout="inline"
                  year={refYear}
                  month1To12={refMonth}
                  onYearChange={setRefYear}
                  onMonthChange={setRefMonth}
                  minYear={minYear}
                  maxYear={maxYear}
                />
              ) : null}
            </DecisionPageToolbar>
          </motion.div>

          <motion.div variants={motionItem} className="space-y-6">
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
                  <p className="text-sm text-muted-foreground">Carregando…</p>
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
                <DecisionStatusStrip
                  status={query.data.status}
                  briefingLine={problemHeadlineFromPrimaryIssue(query.data.primary_issue)}
                />
                {primaryAction !== undefined ? (
                  <DecisionPrimaryBlock
                    action={primaryAction}
                    status={query.data.status}
                    hasSecondarySteps={hasSecondaries}
                    problemHeadline={problemHeadlineFromPrimaryIssue(query.data.primary_issue)}
                    showProblemContext={false}
                  />
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Nada priorizado neste mês.
                  </p>
                )}
                <DecisionSecondaryActions actions={secondaryActions} />
                <DecisionPlaybookCard
                  playbook={getPlaybook(query.data.primary_issue)}
                  phase={query.data.theme_phase ?? null}
                />
                <DecisionCompletePlanSection
                  companyId={companyId}
                  referencePeriod={referencePeriod}
                />
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      </PullToRefresh>
    </ViewDefault>
  );
}
