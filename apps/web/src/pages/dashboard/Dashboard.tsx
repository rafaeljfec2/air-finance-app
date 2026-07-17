import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';

import { CapacityHypothesis } from './components/CapacityHypothesis';
import { DashboardHeader } from './components/DashboardHeader';
import { PillarCard } from './components/PillarCard';
import { PillarDetailModal } from './components/PillarDetailModal';
import { VisualReadings } from './components/VisualReadings';
import { buildExecutiveSummary } from './copy/buildExecutiveSummary';
import { useDashboardPeriod } from './hooks/useDashboardPeriod';
import { useFinancialHealthCheckup } from './hooks/useFinancialHealthCheckup';
import { Callout, Stack } from './laudo-layout/primitives';
import {
  reducedSectionContainerVariants,
  reducedSectionItemVariants,
  sectionContainerVariants,
  sectionItemVariants,
} from './motion';
import type { PillarId } from './types';
import { formatUpdatedAgo } from './utils/formatUpdatedAgo';

/** Financial Health `/dashboard` — wide check-up desk: header, pillar grid, hypothesis, visual readings. */
export function Dashboard() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [detailPillarId, setDetailPillarId] = useState<PillarId | null>(null);
  const reduceMotion = useReducedMotion();

  const { filters, monthLabel, isCurrentMonth, goToPreviousMonth, goToNextMonth } =
    useDashboardPeriod();

  const { checkup, isLoading, isError, refetch, summary, balanceHistory, indebtedness } =
    useFinancialHealthCheckup(companyId, filters);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['indebtedness'] }),
      refetch(),
    ]);
    setIsRefreshing(false);
  };

  const executiveLines = useMemo(
    () => (checkup ? buildExecutiveSummary(checkup) : null),
    [checkup],
  );

  const updatedAgo = useMemo(
    () => formatUpdatedAgo(summary.dataUpdatedAt),
    [summary.dataUpdatedAt],
  );

  const detailPillar = useMemo(
    () => checkup?.pillars.find((pillar) => pillar.id === detailPillarId) ?? null,
    [checkup, detailPillarId],
  );

  const hasCriticalPillar = checkup?.pillars.some((pillar) => pillar.state === 'critical') ?? false;

  const containerVariants = reduceMotion
    ? reducedSectionContainerVariants
    : sectionContainerVariants;
  const itemVariants = reduceMotion ? reducedSectionItemVariants : sectionItemVariants;

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="mx-auto w-full max-w-7xl p-4 pb-16 sm:p-6 lg:p-8">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {Array.from({ length: 6 }, (_, index) => (
                      <Skeleton key={String(index)} className="h-44 w-full bg-muted/20" />
                    ))}
                  </div>
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
              className="flex flex-col gap-8"
            >
              <motion.div variants={itemVariants}>
                <DashboardHeader
                  surfaceQuestion={checkup.surfaceQuestion}
                  lines={executiveLines}
                  monthLabel={monthLabel}
                  isCurrentMonth={isCurrentMonth}
                  onPreviousMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                  onRefresh={() => void handleRefresh()}
                  isRefreshing={isRefreshing}
                  updatedAgo={updatedAgo}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <section aria-label="Seis pilares da capacidade" className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Check-up · seis pilares
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {checkup.pillars.map((pillar) => (
                      <PillarCard
                        key={pillar.id}
                        pillar={pillar}
                        onExplore={() => setDetailPillarId(pillar.id)}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>

              <motion.div variants={itemVariants}>
                <CapacityHypothesis
                  synthesis={checkup.closingSynthesis}
                  critical={hasCriticalPillar}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <VisualReadings
                  periodLabel={monthLabel}
                  summary={summary.data}
                  balanceHistory={balanceHistory.data ?? []}
                  liquidityAvailable={indebtedness.data?.liquidity.available}
                  creditPct={indebtedness.data?.creditUtilization.percentage}
                  companyId={companyId}
                  initialCalendarReferenceDate={filters.referenceDate}
                />
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </PullToRefresh>

      <PillarDetailModal pillar={detailPillar} onClose={() => setDetailPillarId(null)} />
    </ViewDefault>
  );
}
