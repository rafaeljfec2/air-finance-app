import { ClipboardList } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useCompletePlan } from '@/hooks/useCompletePlan';

import { CompletePlanBehaviorCard } from './CompletePlanBehaviorCard';
import { CompletePlanDiagnosis } from './CompletePlanDiagnosis';
import { CompletePlanInstallmentsCard } from './CompletePlanInstallmentsCard';
import { CompletePlanNumbersCard } from './CompletePlanNumbersCard';
import { CompletePlanOutcome } from './CompletePlanOutcome';
import { CompletePlanProjectionCard } from './CompletePlanProjectionCard';
import { CompletePlanRulesCard } from './CompletePlanRulesCard';
import { COMPLETE_PLAN_LABELS } from './copy';

export interface DecisionCompletePlanSectionProps {
  readonly companyId: string;
  readonly referencePeriod?: string;
}

export function DecisionCompletePlanSection({
  companyId,
  referencePeriod,
}: DecisionCompletePlanSectionProps) {
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

  return (
    <Card className="border-border dark:border-border-dark">
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary-100 p-2 dark:bg-primary-900/30">
            <ClipboardList className="h-5 w-5 text-primary-600 dark:text-primary-300" aria-hidden />
          </div>
          <div>
            <CardTitle className="text-lg text-text dark:text-text-dark sm:text-xl">
              {COMPLETE_PLAN_LABELS.sectionTitle}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              {COMPLETE_PLAN_LABELS.sectionDescription}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4 pt-0 sm:px-6">
        <CompletePlanDiagnosis text={data.diagnosis} />
        <CompletePlanNumbersCard numbers={data.numbers} />
        <CompletePlanProjectionCard projection={data.projection} />
        <CompletePlanInstallmentsCard strategy={data.installmentsStrategy} />
        <CompletePlanBehaviorCard behavior={data.behavior} />
        <CompletePlanRulesCard rules={data.personalRules} simpleRule={data.simpleRule} />
        <CompletePlanOutcome text={data.expectedOutcome} cached={data.llmCached} />
      </CardContent>
    </Card>
  );
}
