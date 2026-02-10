import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, CreditCard as CreditCardIcon } from 'lucide-react';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCreditCardInsights } from '@/hooks/useCreditCardInsights';
import {
  InsightsLoadingSkeleton,
  NoApiKeyState,
  InsightsErrorState,
  deriveDecisionState,
} from '@/components/insights/InsightRenderers';
import type { InsightItem } from '@/services/agentService';
import { CardSelectorStrip } from './CardSelectorStrip';
import { DecisionVerdictCard } from './DecisionVerdictCard';
import { EvidenceCard } from './EvidenceCard';
import { OutlookSection } from './OutlookSection';
import { InsightsFooter } from './InsightsFooter';

interface CreditCardInsightsSectionProps {
  readonly companyId: string;
}

const SEVERITY_PRIORITY: Record<string, number> = {
  critical: 3,
  warning: 2,
  info: 1,
};

const MAX_EVIDENCE_ITEMS = 2;

function sortInsightsBySeverity(insights: readonly InsightItem[]): InsightItem[] {
  return [...insights].sort(
    (a, b) => (SEVERITY_PRIORITY[b.severity] ?? 0) - (SEVERITY_PRIORITY[a.severity] ?? 0),
  );
}

export function CreditCardInsightsSection({ companyId }: CreditCardInsightsSectionProps) {
  const { creditCards, isLoading: isLoadingCards } = useCreditCards(companyId);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);
  const evidenceRef = useRef<HTMLDivElement>(null);

  const hasCards = creditCards && creditCards.length > 0;

  useEffect(() => {
    if (isLoadingCards || !hasCards) return;

    if (!selectedCardId || !creditCards?.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(creditCards?.[0]?.id ?? '');
    }
  }, [creditCards, selectedCardId, isLoadingCards, hasCards]);

  const { insights, isLoading, error, generateInsights, isGenerating } = useCreditCardInsights(
    companyId,
    selectedCardId,
  );

  const isNoApiKey = error && 'status' in error && (error as { status: number }).status === 403;

  const state = insights
    ? deriveDecisionState(insights.insights, insights.warnings, insights.confidenceLevel)
    : 'all-clear';

  const evidenceInsights = insights
    ? sortInsightsBySeverity(insights.insights).slice(0, MAX_EVIDENCE_ITEMS)
    : [];

  const hasEvidence = evidenceInsights.length > 0;
  const isAllClear = state === 'all-clear';

  const handleScrollToEvidence = useCallback(() => {
    setIsEvidenceExpanded(true);
    setTimeout(() => {
      evidenceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  useEffect(() => {
    setIsEvidenceExpanded(!isAllClear);
  }, [isAllClear, selectedCardId]);

  return (
    <section>
      <div className="mb-4">
        <CardSelectorStrip
          cards={creditCards ?? []}
          selectedCardId={selectedCardId}
          onSelect={setSelectedCardId}
          isLoading={isLoadingCards}
        />
      </div>

      {hasCards && selectedCardId && (
        <div className="space-y-5">
          {isLoading && <InsightsLoadingSkeleton />}
          {!isLoading && isNoApiKey && <NoApiKeyState />}
          {!isLoading && !isNoApiKey && error && <InsightsErrorState />}

          {!isLoading && !error && insights && (
            <>
              <DecisionVerdictCard
                insights={insights}
                state={state}
                onScrollToEvidence={hasEvidence ? handleScrollToEvidence : undefined}
              />

              {hasEvidence && (
                <div ref={evidenceRef}>
                  {isAllClear && !isEvidenceExpanded ? (
                    <button
                      type="button"
                      onClick={() => setIsEvidenceExpanded(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors"
                    >
                      Ver evidências
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-3">
                        Evidências
                      </h3>
                      <div className="space-y-3">
                        {evidenceInsights.map((insight) => (
                          <EvidenceCard
                            key={`${insight.type}-${insight.title}`}
                            insight={insight}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!hasEvidence && isAllClear && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/30 p-4 text-center">
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">
                    Nenhum ponto de atenção. Tudo sob controle.
                  </p>
                </div>
              )}

              <OutlookSection projections={insights.projections} state={state} />

              <InsightsFooter
                insights={insights}
                onRefresh={() => generateInsights()}
                isRefreshing={isGenerating}
              />
            </>
          )}
        </div>
      )}

      {!isLoadingCards && !hasCards && (
        <div className="rounded-xl border border-border dark:border-border-dark p-6 text-center">
          <CreditCardIcon className="h-8 w-8 text-text-muted dark:text-text-muted-dark mx-auto mb-2" />
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Nenhum cartão de crédito cadastrado.
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
            Cadastre um cartão para começar a receber análises inteligentes.
          </p>
        </div>
      )}
    </section>
  );
}
