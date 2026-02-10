import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useCreditCardInsights } from '@/hooks/useCreditCardInsights';
import { resolveInsightsContent } from '@/components/insights/InsightRenderers';

interface CreditCardInsightsCardProps {
  readonly companyId: string;
  readonly cardId: string;
  readonly defaultExpanded?: boolean;
}

export function CreditCardInsightsCard({
  companyId,
  cardId,
  defaultExpanded = false,
}: CreditCardInsightsCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { insights, isLoading, error, generateInsights, isGenerating } = useCreditCardInsights(
    companyId,
    cardId,
  );

  const isNoApiKey = error && 'status' in error && (error as { status: number }).status === 403;
  const hasWarnings = (insights?.warnings?.length ?? 0) > 0;
  const ExpandIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div className="px-4 lg:px-6">
      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 lg:p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <span className="text-xs lg:text-sm font-semibold text-text dark:text-text-dark">
              Análise Inteligente
            </span>
            {hasWarnings && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {insights?.warnings.length}
              </span>
            )}
          </div>
          <ExpandIcon className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
        </button>

        {isExpanded && (
          <div className="px-3 pb-3 lg:px-4 lg:pb-4 space-y-3">
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
      </div>
    </div>
  );
}
