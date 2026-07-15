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
        className="py-12 text-center max-w-lg mx-auto space-y-2"
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
        className="mx-auto w-full max-w-2xl animate-pulse space-y-4 border-l-2 border-primary-500/40 pl-4 sm:pl-5"
        aria-busy="true"
        aria-label="Loading decision dashboard"
      >
        <div className="h-3 w-32 rounded bg-primary-500/20" />
        <div className="h-9 w-full rounded bg-muted/40 dark:bg-muted/20" />
        <div className="h-5 w-4/5 rounded bg-muted/30 dark:bg-muted/15" />
        <div className="h-16 w-full max-w-md rounded bg-muted/25 dark:bg-muted/15" />
      </div>
    );
  }

  if (isError || !viewModel) {
    return (
      <div role="alert" className="py-12 text-center max-w-lg mx-auto space-y-3">
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
    <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 border-l-2 border-primary-500 dark:border-primary-400 pl-4 sm:gap-6 sm:pl-5">
        {/* 1. Conclusão */}
        <DecisionDashboardStatus
          question={viewModel.question}
          status={viewModel.status}
          dataState={viewModel.dataState}
        />

        {/* 2. Evidências */}
        <PriorityDecisionCards cards={viewModel.priorityCards} />

        {/* 3. Recomendação */}
        <ActionOfTheDayBlock
          label={viewModel.action.label}
          rationale={viewModel.action.rationale}
        />

        {/* 4. Benefício */}
        {showBenefit ? (
          <DecisionInsightBlock
            message={viewModel.insightMessage}
            rationale={viewModel.action.rationale}
          />
        ) : null}

        {/* 5. Exploração */}
        {viewModel.showSecondary ? (
          <DecisionDashboardSecondary
            cards={viewModel.secondaryCards}
            expanded={showSecondaryExpanded}
            onExpand={expandSecondary}
            onCollapse={collapseSecondary}
          />
        ) : null}
      </div>
    </div>
  );
}
