import { useState, useEffect } from 'react';
import { CreditCard as CreditCardIcon } from 'lucide-react';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCreditCardInsights } from '@/hooks/useCreditCardInsights';
import { resolveInsightsContent } from '@/components/insights/InsightRenderers';
import { CardSelectorStrip } from './CardSelectorStrip';

interface CreditCardInsightsSectionProps {
  readonly companyId: string;
}

export function CreditCardInsightsSection({ companyId }: CreditCardInsightsSectionProps) {
  const { creditCards, isLoading: isLoadingCards } = useCreditCards(companyId);
  const [selectedCardId, setSelectedCardId] = useState('');

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

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <CreditCardIcon className="h-4 w-4 lg:h-4.5 lg:w-4.5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-sm lg:text-base font-semibold text-text dark:text-text-dark">
            Cartões de Crédito
          </h2>
          <p className="text-[10px] lg:text-xs text-text-muted dark:text-text-muted-dark">
            Análise inteligente das suas faturas
          </p>
        </div>
      </div>

      <div className="mb-4">
        <CardSelectorStrip
          cards={creditCards ?? []}
          selectedCardId={selectedCardId}
          onSelect={setSelectedCardId}
          isLoading={isLoadingCards}
        />
      </div>

      {hasCards && selectedCardId && (
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4 space-y-3">
          {resolveInsightsContent(
            isLoading,
            !!isNoApiKey,
            error,
            insights,
            generateInsights,
            isGenerating,
          )}
        </div>
      )}

      {!isLoadingCards && !hasCards && (
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 text-center">
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
