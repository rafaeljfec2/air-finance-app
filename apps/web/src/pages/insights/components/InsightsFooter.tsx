import { RefreshCw } from 'lucide-react';
import { CONFIDENCE_STYLES, formatRelativeTime } from '@/components/insights/InsightRenderers';
import type { CreditCardInsight } from '@/services/agentService';

interface InsightsFooterProps {
  readonly insights: CreditCardInsight;
  readonly onRefresh: () => void;
  readonly isRefreshing: boolean;
}

const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function isStale(generatedAt: string): boolean {
  const generated = new Date(generatedAt);
  return Date.now() - generated.getTime() > STALE_THRESHOLD_MS;
}

export function InsightsFooter({ insights, onRefresh, isRefreshing }: InsightsFooterProps) {
  const confidenceConfig = CONFIDENCE_STYLES[insights.confidenceLevel];
  const stale = isStale(insights.generatedAt);

  if (stale) {
    return (
      <div className="flex items-center justify-between pt-3 border-t border-border/30 dark:border-border-dark/30">
        <span className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          Última análise: {formatRelativeTime(insights.generatedAt)}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Analisando...' : 'Atualizar análise'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between pt-3 border-t border-border/30 dark:border-border-dark/30">
      <span className="text-[11px] text-text-muted dark:text-text-muted-dark">
        {formatRelativeTime(insights.generatedAt)}
        <span className="mx-1.5">·</span>
        <span className={confidenceConfig.color}>{confidenceConfig.label}</span>
      </span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Analisando...' : 'Atualizar'}
      </button>
    </div>
  );
}
