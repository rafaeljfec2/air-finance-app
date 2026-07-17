import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useCompletePlan } from '@/hooks/useCompletePlan';
import { useDashboardSummary } from '@/hooks/useDashboard';
import type { DecisionEngineEvaluateResponse } from '@/services/decisionEngineService';

import { usePeriodReadingHeroMetrics } from '../../hooks/usePeriodReadingHeroMetrics';
import { buildPeriodReadingBehaviorCards } from '../../mappers/buildPeriodReadingBehaviorCards';
import {
  buildImprovementBannerText,
  buildPeriodReadingHeadline,
  shouldShowImprovementBanner,
} from '../../mappers/buildPeriodReadingHeroNarrative';
import { buildPeriodReadingJourney } from '../../mappers/buildPeriodReadingJourney';
import { buildPeriodReadingPlanSteps } from '../../mappers/buildPeriodReadingPlanSteps';
import { buildPeriodReadingPressure } from '../../mappers/buildPeriodReadingPressure';
import { buildPeriodReadingProjectionMilestones } from '../../mappers/buildPeriodReadingProjectionMilestones';

import { PeriodReadingBehavior } from './PeriodReadingBehavior';
import { PeriodReadingCutSuggestions } from './PeriodReadingCutSuggestions';
import { PeriodReadingHero } from './PeriodReadingHero';
import { PeriodReadingJourney } from './PeriodReadingJourney';
import { PeriodReadingOutcome } from './PeriodReadingOutcome';
import { PeriodReadingPlan } from './PeriodReadingPlan';
import { PeriodReadingPressure } from './PeriodReadingPressure';
import { PeriodReadingProjection } from './PeriodReadingProjection';
import { PeriodReadingRules } from './PeriodReadingRules';

interface PeriodReadingBodyProps {
  readonly companyId: string;
  readonly referencePeriod: string;
  readonly evaluation: DecisionEngineEvaluateResponse;
}

function referenceDateFromPeriod(referencePeriod: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(referencePeriod.trim());
  if (!match) {
    return new Date().toISOString().slice(0, 10);
  }
  return `${match[1]}-${match[2]}-15`;
}

export function PeriodReadingBody({
  companyId,
  referencePeriod,
  evaluation,
}: Readonly<PeriodReadingBodyProps>) {
  const planQuery = useCompletePlan(companyId, { referencePeriod });
  const summaryQuery = useDashboardSummary(companyId, {
    timeRange: 'month',
    referenceDate: referenceDateFromPeriod(referencePeriod),
  });
  const heroMetrics = usePeriodReadingHeroMetrics(companyId, referencePeriod);

  if (planQuery.isLoading) {
    return (
      <Card className="border-border dark:border-border-dark">
        <CardHeader className="flex flex-col items-center gap-3 py-10">
          <Spinner size="md" className="text-primary-500" />
          <p className="text-sm text-muted-foreground">Montando a leitura do período…</p>
        </CardHeader>
      </Card>
    );
  }

  if (planQuery.isError || planQuery.data === undefined) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Não foi possível carregar o plano
          </CardTitle>
          <CardDescription>
            {planQuery.error instanceof Error
              ? planQuery.error.message
              : 'Tente atualizar a página em instantes.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const plan = planQuery.data;
  const headline = buildPeriodReadingHeadline(evaluation.primary_issue);
  const showBanner = shouldShowImprovementBanner({
    todayCommittedPct: plan.numbers.committedPct,
    in90DaysCommittedPct: plan.projection.in90Days.committedPct,
  });
  const improvementBanner = showBanner ? buildImprovementBannerText(plan.expectedOutcome) : null;

  const explanation = [plan.diagnosis, plan.coherenceNote]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' ');

  const journey = buildPeriodReadingJourney({
    income: summaryQuery.data?.income ?? plan.numbers.netIncome,
    expenses: summaryQuery.data?.expenses ?? 0,
    numbers: plan.numbers,
  });

  const pressure = buildPeriodReadingPressure({
    numbers: plan.numbers,
    variableSpending: plan.variableSpending,
  });

  const planSteps = buildPeriodReadingPlanSteps(plan);
  const milestones = buildPeriodReadingProjectionMilestones({
    todayCommittedPct: plan.numbers.committedPct,
    todayTotalCommitted: plan.numbers.totalCommitted,
    projection: plan.projection,
  });
  const behaviorCards = buildPeriodReadingBehaviorCards(plan);

  return (
    <div className="space-y-5">
      <PeriodReadingHero
        headline={headline}
        explanation={explanation}
        improvementBanner={improvementBanner}
        metrics={heroMetrics}
      />
      <PeriodReadingJourney stages={journey} />
      <PeriodReadingPressure cards={pressure} />
      <PeriodReadingPlan
        steps={planSteps}
        reductionNeeded={plan.numbers.reductionNeeded}
        targetCommitted={plan.projection.in90Days.totalCommitted}
      />
      <PeriodReadingProjection milestones={milestones} />
      <PeriodReadingCutSuggestions categories={plan.variableSpending.topCategories} />
      <PeriodReadingBehavior cards={behaviorCards} />
      <PeriodReadingRules rules={plan.personalRules} simpleRule={plan.simpleRule} />
      <PeriodReadingOutcome
        ifNoChange={plan.projection.ifNoChange}
        expectedOutcome={plan.expectedOutcome}
      />
    </div>
  );
}
