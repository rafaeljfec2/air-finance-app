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

import { DecisionPageToolbar } from './components/DecisionPageToolbar';
import { DecisionPeriodCoverageBanner } from './components/DecisionPeriodCoverageBanner';
import { DecisionPeriodDropdown } from './components/DecisionPeriodDropdown';
import { PeriodReadingBody } from './components/period-reading/PeriodReadingBody';
import {
  buildYYYYMM,
  getCurrentYYYYMM,
  resolveEvaluateAutoReferencePeriod,
} from './utils/referencePeriod';

const motionContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const motionItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function FinancialDecisionPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const companyName = activeCompany?.name?.trim() ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const maxYear = new Date().getFullYear();
  const minYear = maxYear - 4;

  const [refYear, setRefYear] = useState(() => new Date().getFullYear());
  const [refMonth, setRefMonth] = useState(() => new Date().getMonth() + 1);

  const referencePeriod = resolveEvaluateAutoReferencePeriod(refYear, refMonth);
  const viewingReferencePeriod = buildYYYYMM(refYear, refMonth);
  const isNonCurrentDecisionPeriod = viewingReferencePeriod !== getCurrentYYYYMM();

  const query = useDecisionEngineEvaluateAuto(companyId, {
    referencePeriod,
  });

  const primaryIssue = query.data?.primary_issue ?? '';
  const isDataIncomplete = primaryIssue === 'data_incomplete';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['decision-engine'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['accounts', 'total-balance'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['dashboard', 'summary'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['budget', 'receivables'],
    });
    setIsRefreshing(false);
  };

  const emptyCompany = companyId === '';

  const toolbarSubtitle = emptyCompany
    ? 'Escolha um perfil para ver a leitura deste período.'
    : 'Exploração do mês — cobertura, lacunas e detalhe.';

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing || query.isFetching}>
        <motion.div
          variants={motionContainer}
          initial="hidden"
          animate="show"
          className="space-y-5 px-4 pb-8 pt-0 sm:px-6"
        >
          <motion.div variants={motionItem}>
            <DecisionPageToolbar
              title="Leitura do período"
              subtitle={toolbarSubtitle}
              showRefresh={!emptyCompany}
              isFetching={query.isFetching}
              onRefresh={() => void query.refetch()}
              actions={
                !emptyCompany ? (
                  <DecisionPeriodDropdown
                    year={refYear}
                    month1To12={refMonth}
                    onYearChange={setRefYear}
                    onMonthChange={setRefMonth}
                    minYear={minYear}
                    maxYear={maxYear}
                    isNonCurrentPeriod={isNonCurrentDecisionPeriod}
                  />
                ) : undefined
              }
            />
          </motion.div>

          <motion.div variants={motionItem} className="space-y-5">
            {emptyCompany ? (
              <Card className="border-border dark:border-border-dark">
                <CardHeader>
                  <CardTitle className="text-lg">Escolha um perfil</CardTitle>
                  <CardDescription>
                    Selecione uma empresa no menu de perfis para carregar a leitura deste mês.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {!emptyCompany && companyName !== '' && isDataIncomplete ? (
              <p className="text-xs leading-snug text-muted-foreground">
                Perfil ativo: <span className="font-medium text-foreground">{companyName}</span>.
                Este perfil não tem fatos suficientes — o parecer de hoje pode estar em outro perfil
                na Home.
              </p>
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
              <div className="space-y-5">
                {query.data.period_coverage !== undefined ? (
                  <DecisionPeriodCoverageBanner periodCoverage={query.data.period_coverage} />
                ) : null}
                <PeriodReadingBody
                  companyId={companyId}
                  referencePeriod={viewingReferencePeriod}
                  evaluation={query.data}
                />
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      </PullToRefresh>
    </ViewDefault>
  );
}
