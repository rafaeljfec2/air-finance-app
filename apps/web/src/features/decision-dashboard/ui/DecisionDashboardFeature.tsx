import { Button } from '@/components/ui/button';

import { useDecisionDashboard } from '../hooks/useDecisionDashboard';

import { ActionOfTheDayBlock } from './components/ActionOfTheDayBlock';
import { DecisionDashboardSecondary } from './components/DecisionDashboardSecondary';
import { DecisionDashboardStatus } from './components/DecisionDashboardStatus';
import { DecisionInsightBlock } from './components/DecisionInsightBlock';
import { PriorityDecisionCards } from './components/PriorityDecisionCards';

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
      <div
        className="rounded-2xl border border-border/60 bg-card px-5 py-10 text-center dark:border-border-dark/60 dark:bg-card-dark"
        aria-label="Awaiting company selection"
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          Escolha uma empresa para montarmos seu parecer de hoje.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="animate-pulse space-y-5 rounded-2xl border border-border/60 bg-card p-5 dark:border-border-dark/60 dark:bg-card-dark sm:p-6"
        aria-busy="true"
        aria-label="Loading decision dashboard"
      >
        <div className="flex justify-between gap-3">
          <div className="h-4 w-36 rounded bg-primary-500/20" />
          <div className="h-3 w-24 rounded bg-muted/30" />
        </div>
        <div className="h-10 w-full rounded bg-muted/40 dark:bg-muted/20" />
        <div className="h-16 w-full rounded-lg bg-muted/25" />
        <div className="h-28 w-full rounded-xl bg-primary-500/10" />
      </div>
    );
  }

  if (isError || !viewModel) {
    return (
      <div
        role="alert"
        className="space-y-3 rounded-2xl border border-border/60 bg-card px-5 py-10 text-center dark:border-border-dark/60 dark:bg-card-dark"
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          Não conseguimos montar seu parecer agora. Vamos tentar de novo?
        </p>
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const showBenefit =
    Boolean(viewModel.insightMessage) || viewModel.action.rationale.trim().length > 0;

  return (
    <article className="rounded-2xl border border-border/60 bg-card shadow-sm dark:border-border-dark/60 dark:bg-card-dark">
      <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-7">
        <DecisionDashboardStatus
          question={viewModel.question}
          status={viewModel.status}
          dataState={viewModel.dataState}
        />

        <PriorityDecisionCards cards={viewModel.priorityCards} />

        <ActionOfTheDayBlock
          label={viewModel.action.label}
          rationale={viewModel.action.rationale}
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
    </article>
  );
}
