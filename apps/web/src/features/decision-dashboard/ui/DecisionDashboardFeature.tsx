import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import { useDecisionDashboard } from '../hooks/useDecisionDashboard';

import { DecisionDashboardLoading } from './components/DecisionDashboardLoading';
import { CurrentSituationCard } from './components/desk/CurrentSituationCard';
import { DailyTipFooter } from './components/desk/DailyTipFooter';
import { DecisionBlock } from './components/desk/DecisionBlock';
import { DeskHeader } from './components/desk/DeskHeader';
import { MonthSummaryCard } from './components/desk/MonthSummaryCard';
import { QuickTasksCard } from './components/desk/QuickTasksCard';
import { RecentMovementsCard } from './components/desk/RecentMovementsCard';
import { SpendingDonutCard } from './components/desk/SpendingDonutCard';
import { countMovements } from './desk/deskMetrics';
import { resolveDailyTip } from './desk/resolveDailyTip';

function BriefingShell({
  children,
  className = '',
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 opacity-80" aria-hidden />
      {children}
    </article>
  );
}

export function DecisionDashboardFeature() {
  const {
    isLoading,
    isError,
    isAwaitingCompany,
    loadingSteps,
    viewModel,
    summary,
    expensesByCategory,
    recentMovements,
    isRecentMovementsLoading,
  } = useDecisionDashboard();

  if (isAwaitingCompany) {
    return (
      <BriefingShell>
        <div className="px-4 py-12 text-center sm:px-6" aria-label="Awaiting company selection">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Escolha uma empresa para montarmos seu parecer de hoje — com calma e sem pressa.
          </p>
        </div>
      </BriefingShell>
    );
  }

  if (isLoading) {
    return <DecisionDashboardLoading steps={loadingSteps} />;
  }

  if (isError || !viewModel) {
    return (
      <BriefingShell>
        <div role="alert" className="space-y-4 px-4 py-12 text-center sm:px-6">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Não conseguimos montar seu parecer agora. Sem drama — podemos tentar de novo.
          </p>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </BriefingShell>
    );
  }

  const movementCount = countMovements(recentMovements);
  const tip = resolveDailyTip(summary);

  return (
    <div className="space-y-3.5" aria-label="Decision desk">
      <DeskHeader />

      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark lg:h-[168px]">
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500 opacity-80" aria-hidden />
        <div className="grid h-full grid-cols-1 gap-3 p-3 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DecisionBlock
              label={viewModel.action.label}
              rationale={viewModel.action.rationale}
              insightMessage={viewModel.insightMessage}
            />
          </div>
          <div className="lg:col-span-2 lg:py-2">
            <CurrentSituationCard
              cards={viewModel.priorityCards}
              statusLines={viewModel.statusLines}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 lg:h-[297px] lg:grid-cols-2">
        <MonthSummaryCard summary={summary} movementCount={movementCount} />
        <SpendingDonutCard
          expensesByCategory={expensesByCategory}
          totalExpenses={summary?.expenses ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:h-[332px] lg:grid-cols-2">
        <RecentMovementsCard movements={recentMovements} isLoading={isRecentMovementsLoading} />
        <QuickTasksCard />
      </div>

      <DailyTipFooter tip={tip} />
    </div>
  );
}
