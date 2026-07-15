import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import { useDecisionDashboard } from '../hooks/useDecisionDashboard';

import { ActionOfTheDayBlock } from './components/ActionOfTheDayBlock';
import { BehaviorHistoryBlock } from './components/BehaviorHistoryBlock';
import { DecisionDashboardSecondary } from './components/DecisionDashboardSecondary';
import { DecisionDashboardStatus } from './components/DecisionDashboardStatus';
import { DecisionInsightBlock } from './components/DecisionInsightBlock';
import { PreserveAvoidBlock } from './components/PreserveAvoidBlock';
import { PriorityDecisionCards } from './components/PriorityDecisionCards';

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
    viewModel,
    showSecondaryExpanded,
    expandSecondary,
    collapseSecondary,
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
    return (
      <BriefingShell>
        <div
          className="animate-pulse space-y-6 p-4 sm:p-5"
          aria-busy="true"
          aria-label="Loading decision dashboard"
        >
          <div className="flex justify-between gap-3">
            <div className="h-4 w-40 rounded-full bg-primary-500/15" />
            <div className="h-3 w-24 rounded-full bg-muted/25" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-[92%] rounded-lg bg-muted/30 dark:bg-muted/15" />
            <div className="h-8 w-[70%] rounded-lg bg-muted/25 dark:bg-muted/10" />
          </div>
          <div className="h-20 w-full rounded-xl bg-muted/20" />
          <div className="h-24 w-full rounded-xl bg-muted/15" />
        </div>
      </BriefingShell>
    );
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

  const preserve = viewModel.preserveLines ?? [];
  const avoid = viewModel.avoidLines ?? [];
  const history = viewModel.historyLines ?? [];
  const showBenefit =
    preserve.length === 0 &&
    (Boolean(viewModel.insightMessage) || viewModel.action.rationale.trim().length > 0);

  return (
    <BriefingShell>
      <div className="space-y-6 p-4 sm:space-y-7 sm:p-5 md:p-6">
        <DecisionDashboardStatus
          question={viewModel.question}
          status={viewModel.status}
          statusLines={viewModel.statusLines}
          dataState={viewModel.dataState}
        />

        <PriorityDecisionCards cards={viewModel.priorityCards} />

        <BehaviorHistoryBlock lines={history} />

        <PreserveAvoidBlock preserve={preserve} avoid={avoid} />

        <ActionOfTheDayBlock
          label={viewModel.action.label}
          rationale={viewModel.action.rationale}
          ctaLabel={viewModel.action.ctaLabel}
          benefitSlot={
            showBenefit ? (
              <DecisionInsightBlock
                message={viewModel.insightMessage}
                rationale={viewModel.action.rationale}
              />
            ) : null
          }
        />

        {viewModel.showSecondary ? (
          <DecisionDashboardSecondary
            cards={viewModel.secondaryCards}
            expanded={showSecondaryExpanded}
            onExpand={expandSecondary}
            onCollapse={collapseSecondary}
          />
        ) : null}
      </div>
    </BriefingShell>
  );
}
