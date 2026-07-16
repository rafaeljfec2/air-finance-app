import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import { useDecisionDashboard } from '../hooks/useDecisionDashboard';

import { ActionOfTheDayBlock } from './components/ActionOfTheDayBlock';
import { BehaviorHistoryBlock } from './components/BehaviorHistoryBlock';
import { DecisionDashboardLoading } from './components/DecisionDashboardLoading';
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
    loadingMessage,
    loadingSteps,
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
      <DecisionDashboardLoading
        message={loadingMessage ?? 'Montando seu parecer de hoje…'}
        steps={loadingSteps}
      />
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
      <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
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
