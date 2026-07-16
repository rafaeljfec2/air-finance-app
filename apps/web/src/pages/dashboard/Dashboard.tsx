import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import type { DashboardFilters } from '@/types/dashboard';

import { CapacityHypothesis } from './components/CapacityHypothesis';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { PillarTimeline } from './components/PillarTimeline';
import { VisualReadings, type FlowPoint } from './components/VisualReadings';
import { buildExecutiveSummary } from './copy/buildExecutiveSummary';
import { useFinancialHealthCheckup } from './hooks/useFinancialHealthCheckup';
import { Callout, Stack } from './laudo-layout/primitives';
import {
  reducedSectionContainerVariants,
  reducedSectionItemVariants,
  sectionContainerVariants,
  sectionItemVariants,
} from './motion';
import type { PillarId } from './types';

/** Financial Health `/dashboard` — UX02 vertical progressive reading + pillar timeline. */
export function Dashboard() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedPillarId, setExpandedPillarId] = useState<PillarId | null>(null);
  const reduceMotion = useReducedMotion();

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: new Date().toISOString(),
    }),
    [],
  );

  const {
    checkup,
    isLoading,
    isError,
    refetch,
    summary,
    balanceHistory,
    expensesByCategory,
    indebtedness,
  } = useFinancialHealthCheckup(companyId, filters);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['indebtedness'] }),
      refetch(),
    ]);
    setIsRefreshing(false);
  };

  const periodLabel = useMemo(() => {
    const start = summary.data?.periodStart;
    if (!start) {
      return format(new Date(), 'MMM yyyy', { locale: ptBR });
    }
    return format(new Date(start), 'MMM yyyy', { locale: ptBR });
  }, [summary.data?.periodStart]);

  const flowChartData = useMemo((): FlowPoint[] => {
    const points = balanceHistory.data ?? [];
    if (points.length === 0 && summary.data) {
      return [
        {
          label: periodLabel,
          income: Math.round(summary.data.income),
          expenses: Math.round(summary.data.expenses),
        },
      ];
    }
    return points.map((point) => ({
      label: format(new Date(point.date), 'dd/MM', { locale: ptBR }),
      income: Math.round(point.income),
      expenses: Math.round(point.expenses),
    }));
  }, [balanceHistory.data, summary.data, periodLabel]);

  const executiveLines = useMemo(
    () => (checkup ? buildExecutiveSummary(checkup) : null),
    [checkup],
  );

  const containerVariants = reduceMotion
    ? reducedSectionContainerVariants
    : sectionContainerVariants;
  const itemVariants = reduceMotion ? reducedSectionItemVariants : sectionItemVariants;

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="mx-auto w-full max-w-[720px] p-4 pb-16 sm:p-6 lg:p-8">
          {!companyId ? (
            <Callout tone="neutral">
              Selecione um contexto para montar a leitura de capacidade do sistema.
            </Callout>
          ) : null}

          <AnimatePresence mode="wait">
            {companyId && isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
              >
                <Stack gap={16}>
                  <Skeleton className="h-10 w-3/4 bg-muted/30" />
                  <Skeleton className="h-28 w-full bg-muted/20" />
                  <Skeleton className="h-24 w-full bg-muted/20" />
                </Stack>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {companyId && isError && !checkup ? (
            <Stack gap={12}>
              <Callout tone="warning">
                Não foi possível carregar os sinais de capacidade neste momento.
              </Callout>
              <Button type="button" variant="outline" onClick={() => void handleRefresh()}>
                Tentar novamente
              </Button>
            </Stack>
          ) : null}

          {checkup && executiveLines ? (
            <motion.div
              key="ready"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-10"
            >
              <motion.div variants={itemVariants}>
                <ExecutiveSummary
                  lines={executiveLines}
                  periodLabel={periodLabel}
                  surfaceQuestion={checkup.surfaceQuestion}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <PillarTimeline
                  pillars={checkup.pillars}
                  expandedPillarId={expandedPillarId}
                  onToggle={(id) => setExpandedPillarId((current) => (current === id ? null : id))}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <CapacityHypothesis synthesis={checkup.closingSynthesis} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <VisualReadings
                  periodLabel={periodLabel}
                  summary={summary.data}
                  flowChartData={flowChartData}
                  expensesByCategory={expensesByCategory.data ?? []}
                  liquidityAvailable={indebtedness.data?.liquidity.available}
                  creditPct={indebtedness.data?.creditUtilization.percentage}
                />
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
