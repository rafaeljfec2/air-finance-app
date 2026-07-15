import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useCompletePlan } from '@/hooks/useCompletePlan';
import type { CompletePlanResponse } from '@/services/completePlanService';

import { CompletePlanBehaviorCard } from './CompletePlanBehaviorCard';
import { CompletePlanCoherenceNote } from './CompletePlanCoherenceNote';
import { CompletePlanDiagnosis } from './CompletePlanDiagnosis';
import { CompletePlanInfoHint } from './CompletePlanInfoHint';
import { CompletePlanInstallmentsCard } from './CompletePlanInstallmentsCard';
import { CompletePlanNumbersCard } from './CompletePlanNumbersCard';
import { CompletePlanOutcome } from './CompletePlanOutcome';
import { CompletePlanProjectionCard } from './CompletePlanProjectionCard';
import { CompletePlanRulesCard } from './CompletePlanRulesCard';
import { CompletePlanVariableSpendingCard } from './CompletePlanVariableSpendingCard';
import { COMPLETE_PLAN_LABELS } from './copy';
import { formatBrl, formatPercent, formatSignedOneDecimalPercent } from './format';

const VARIABLE_SUMMARY_BADGE: Readonly<Record<'healthy' | 'attention' | 'critical', string>> = {
  healthy:
    'inline-flex w-fit rounded-full border border-emerald-500/35 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-400/35 dark:bg-emerald-950/35 dark:text-emerald-100',
  attention:
    'inline-flex w-fit rounded-full border border-amber-500/40 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-100',
  critical:
    'inline-flex w-fit rounded-full border border-red-500/40 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-100',
};

const VARIABLE_SUMMARY_BUCKET_LABEL: Readonly<
  Record<'healthy' | 'attention' | 'critical', string>
> = {
  healthy: COMPLETE_PLAN_LABELS.variableSpendingBucketHealthy,
  attention: COMPLETE_PLAN_LABELS.variableSpendingBucketAttention,
  critical: COMPLETE_PLAN_LABELS.variableSpendingBucketCritical,
};

const VARIABLE_SUMMARY_BUCKET_HINT: Readonly<Record<'healthy' | 'attention' | 'critical', string>> =
  {
    healthy: COMPLETE_PLAN_LABELS.variableSpendingBucketHealthyHint,
    attention: COMPLETE_PLAN_LABELS.variableSpendingBucketAttentionHint,
    critical: COMPLETE_PLAN_LABELS.variableSpendingBucketCriticalHint,
  };

function revealPlanDetailAndScroll(
  panel: HTMLDetailsElement | null,
  anchorElementId: string,
): void {
  if (panel) {
    panel.open = true;
  }
  window.requestAnimationFrame(() => {
    document.getElementById(anchorElementId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}

function isSparseCompletePlan(data: CompletePlanResponse): boolean {
  if (data.primary_issue === 'data_incomplete') {
    return true;
  }
  return (
    data.numbers.netIncome === 0 &&
    data.numbers.totalCommitted === 0 &&
    data.variableSpending.totalVariable === 0
  );
}

export interface DecisionCompletePlanSectionProps {
  readonly companyId: string;
  readonly referencePeriod?: string;
}

export function DecisionCompletePlanSection({
  companyId,
  referencePeriod,
}: DecisionCompletePlanSectionProps) {
  const planDetailsRef = useRef<HTMLDetailsElement>(null);
  const query = useCompletePlan(companyId, { referencePeriod });

  if (query.isLoading) {
    return (
      <Card className="border-border dark:border-border-dark">
        <CardHeader className="flex flex-col items-center gap-3 py-10">
          <Spinner size="md" className="text-primary-500" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{COMPLETE_PLAN_LABELS.loading}</p>
        </CardHeader>
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card className="border-border dark:border-border-dark">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-text dark:text-text-dark">
            {COMPLETE_PLAN_LABELS.error}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
            {query.error instanceof Error ? query.error.message : COMPLETE_PLAN_LABELS.error}
          </CardDescription>
          <Button
            type="button"
            variant="outline"
            className="mt-2 min-h-[44px] w-full sm:w-auto"
            onClick={() => void query.refetch()}
          >
            {COMPLETE_PLAN_LABELS.retry}
          </Button>
        </CardHeader>
      </Card>
    );
  }

  if (!query.data) return null;

  const data = query.data;

  if (isSparseCompletePlan(data)) {
    return (
      <Card className="border-border dark:border-border-dark">
        <CardHeader className="space-y-2 p-4 sm:p-5">
          <CardTitle className="text-lg text-text dark:text-text-dark">
            {COMPLETE_PLAN_LABELS.sparseTitle}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
            {COMPLETE_PLAN_LABELS.sparseDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 pt-0 sm:px-5">
          {data.diagnosis.trim() !== '' ? (
            <p className="text-sm leading-relaxed text-text/90 dark:text-text-dark/90">
              {data.diagnosis}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">{COMPLETE_PLAN_LABELS.sparseCtaHint}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <RouterLink
              to="/home"
              className="min-h-[44px] content-center font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
            >
              Ir para a Home
            </RouterLink>
            <RouterLink
              to="/budget"
              className="min-h-[44px] content-center text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
            >
              Orçamento
            </RouterLink>
            <RouterLink
              to="/transactions"
              className="min-h-[44px] content-center text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
            >
              Transações
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border dark:border-border-dark">
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <CardTitle className="text-lg text-text dark:text-text-dark sm:text-xl">
          {COMPLETE_PLAN_LABELS.sectionTitle}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {COMPLETE_PLAN_LABELS.sectionDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4 pt-0 sm:px-6">
        <CompletePlanDiagnosis text={data.diagnosis} />
        <CompletePlanCoherenceNote text={data.coherenceNote} />
        <CompletePlanNumbersCard numbers={data.numbers} />

        <section
          aria-label={COMPLETE_PLAN_LABELS.variableSpendingSummaryTitle}
          className="rounded-md border border-border/80 bg-card/40 px-3 py-3 dark:border-border-dark/80 dark:bg-card-dark/30 sm:px-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {COMPLETE_PLAN_LABELS.variableSpendingSummaryTitle}
                </p>
                <CompletePlanInfoHint
                  testId="variable-spending-summary-info"
                  ariaLabel={COMPLETE_PLAN_LABELS.variableSpendingSummaryInfoToggle}
                  content={COMPLETE_PLAN_LABELS.variableSpendingSummaryHint}
                />
              </div>
              <p className="text-sm font-medium text-text dark:text-text-dark">
                <span className="font-semibold">
                  {formatBrl(data.variableSpending.totalVariable)}
                </span>
                {data.variableSpending.percentOfIncome !== null ? (
                  <>
                    {' '}
                    · {formatPercent(data.variableSpending.percentOfIncome)}{' '}
                    {COMPLETE_PLAN_LABELS.variableSpendingVsIncome}
                  </>
                ) : null}
                {data.variableSpending.monthOverMonthChangePct !== null ? (
                  <>
                    {' '}
                    · {formatSignedOneDecimalPercent(
                      data.variableSpending.monthOverMonthChangePct,
                    )}{' '}
                    {COMPLETE_PLAN_LABELS.variableSpendingMomLabel}
                  </>
                ) : data.variableSpending.totalVariable <= 0 &&
                  data.variableSpending.previousTotalVariable > 0 ? (
                  <> · {COMPLETE_PLAN_LABELS.variableSpendingMomZeroCurrent}</>
                ) : null}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <div className="flex items-center gap-1">
                <span
                  role="status"
                  className={VARIABLE_SUMMARY_BADGE[data.variableSpending.bucketHealth]}
                >
                  {VARIABLE_SUMMARY_BUCKET_LABEL[data.variableSpending.bucketHealth]}
                </span>
                <CompletePlanInfoHint
                  testId="variable-spending-bucket-info"
                  ariaLabel={COMPLETE_PLAN_LABELS.variableSpendingBucketInfoToggle}
                  content={VARIABLE_SUMMARY_BUCKET_HINT[data.variableSpending.bucketHealth]}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="min-h-[44px] justify-start px-2 text-primary-600 hover:bg-transparent dark:text-primary-400 sm:justify-end"
                onClick={() =>
                  revealPlanDetailAndScroll(planDetailsRef.current, 'complete-plan-variable-detail')
                }
              >
                {COMPLETE_PLAN_LABELS.variableSpendingOpenDetail}
              </Button>
            </div>
          </div>
        </section>

        <details
          ref={planDetailsRef}
          className="rounded-md border border-border/80 open:[&>summary_svg]:rotate-180 dark:border-border-dark/80"
        >
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-md px-2 py-2 text-sm font-medium text-primary-600 hover:bg-gray-100 dark:text-primary-400 dark:hover:bg-gray-800/60 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 text-left">
              {COMPLETE_PLAN_LABELS.planDetailsSummary}
              <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
                {COMPLETE_PLAN_LABELS.planDetailsHint}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
          </summary>
          <div className="space-y-4 border-t border-border/60 pt-3 dark:border-border-dark/60">
            <CompletePlanProjectionCard projection={data.projection} />
            <CompletePlanInstallmentsCard strategy={data.installmentsStrategy} />
            <CompletePlanVariableSpendingCard variableSpending={data.variableSpending} />
            <CompletePlanBehaviorCard behavior={data.behavior} />
            <CompletePlanRulesCard rules={data.personalRules} simpleRule={data.simpleRule} />
            <CompletePlanOutcome
              text={data.expectedOutcome}
              cached={data.llmCached}
              referencePeriod={data.referencePeriod}
              generatedAt={data.generatedAt}
            />
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
