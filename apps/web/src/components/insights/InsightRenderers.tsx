import {
  AlertTriangle,
  BarChart3,
  Clock,
  Info,
  RefreshCw,
  Settings,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import type {
  CreditCardInsight,
  InsightItem,
  ProjectionItem,
  WarningItem,
} from '@/services/agentService';

export type DecisionState = 'all-clear' | 'attention' | 'risk';

export function deriveDecisionState(
  insights: readonly { severity: 'info' | 'warning' | 'critical' }[],
  warnings: readonly { severity: 'low' | 'medium' | 'high' }[],
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA',
): DecisionState {
  const hasCriticalInsight = insights.some((i) => i.severity === 'critical');
  const hasHighWarning = warnings.some((w) => w.severity === 'high');

  if (hasCriticalInsight || hasHighWarning) return 'risk';

  const hasWarningInsight = insights.some((i) => i.severity === 'warning');
  const hasMediumWarning = warnings.some((w) => w.severity === 'medium');
  const isLowConfidence = confidenceLevel === 'LOW';

  if (hasWarningInsight || hasMediumWarning || isLowConfidence) return 'attention';

  return 'all-clear';
}

export const SEVERITY_STYLES = {
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
} as const;

export const WARNING_SEVERITY_STYLES = {
  low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
} as const;

export const CONFIDENCE_STYLES = {
  HIGH: { label: 'Alta confiança', color: 'text-green-600 dark:text-green-400' },
  MEDIUM: { label: 'Confiança média', color: 'text-amber-600 dark:text-amber-400' },
  LOW: { label: 'Baixa confiança', color: 'text-red-600 dark:text-red-400' },
  INSUFFICIENT_DATA: { label: 'Dados insuficientes', color: 'text-slate-500' },
} as const;

export function getInsightIcon(type: string) {
  switch (type) {
    case 'SPENDING_PATTERN':
      return <BarChart3 className="h-3.5 w-3.5" />;
    case 'LIMIT_USAGE':
      return <ShieldAlert className="h-3.5 w-3.5" />;
    case 'INSTALLMENT_IMPACT':
      return <TrendingUp className="h-3.5 w-3.5" />;
    case 'CATEGORY_ANALYSIS':
      return <BarChart3 className="h-3.5 w-3.5" />;
    default:
      return <Info className="h-3.5 w-3.5" />;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatRelativeTime(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `Há ${diffMinutes} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  return `Há ${diffDays} dia(s)`;
}

export function InsightItemRow({ insight }: { readonly insight: InsightItem }) {
  return (
    <div
      className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${SEVERITY_STYLES[insight.severity]}`}
    >
      <div className="mt-0.5 shrink-0">{getInsightIcon(insight.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight">{insight.title}</p>
        <p className="text-[11px] leading-snug opacity-80 mt-0.5">{insight.description}</p>
        {insight.value != null && (
          <p className="text-xs font-bold mt-1">{formatCurrency(insight.value)}</p>
        )}
      </div>
    </div>
  );
}

export function WarningItemRow({ warning }: { readonly warning: WarningItem }) {
  return (
    <div
      className={`flex items-start gap-2.5 p-2.5 rounded-lg ${WARNING_SEVERITY_STYLES[warning.severity]}`}
    >
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight">{warning.message}</p>
        {warning.actionSuggestion && (
          <p className="text-[11px] leading-snug opacity-80 mt-0.5">{warning.actionSuggestion}</p>
        )}
      </div>
    </div>
  );
}

export function ProjectionRow({ projection }: { readonly projection: ProjectionItem }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 dark:border-border-dark/50 last:border-b-0">
      <span className="text-xs text-text-muted dark:text-text-muted-dark">{projection.month}</span>
      <span className="text-xs font-semibold text-text dark:text-text-dark">
        {formatCurrency(projection.projectedTotal)}
      </span>
    </div>
  );
}

export function InsightsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="rounded-2xl p-5 lg:p-7 bg-slate-100 dark:bg-slate-800/50 space-y-3">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mt-1" />
      </div>

      <div className="space-y-3">
        {['skel-ev-a', 'skel-ev-b'].map((id) => (
          <div
            key={id}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2"
          >
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-28" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
        ))}
      </div>

      <div className="space-y-2 py-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-32" />
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full w-full" />
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full w-4/5" />
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function NoApiKeyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <Settings className="h-6 w-6 text-text-muted dark:text-text-muted-dark" />
      <p className="text-xs text-text-muted dark:text-text-muted-dark">
        Configure sua chave OpenAI nas configurações para ativar a análise inteligente.
      </p>
    </div>
  );
}

export function InsightsErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <p className="text-xs text-text-muted dark:text-text-muted-dark">
        Não foi possível carregar a análise. Tente novamente mais tarde.
      </p>
    </div>
  );
}

interface InsightsContentProps {
  readonly insights: CreditCardInsight;
  readonly generateInsights: () => void;
  readonly isGenerating: boolean;
}

export function InsightsContent({
  insights,
  generateInsights,
  isGenerating,
}: InsightsContentProps) {
  const hasWarnings = insights.warnings.length > 0;
  const hasProjections = insights.projections.length > 0;
  const confidenceConfig = CONFIDENCE_STYLES[insights.confidenceLevel];

  return (
    <>
      <p className="text-xs lg:text-sm text-text dark:text-text-dark leading-relaxed">
        {insights.summary}
      </p>

      {insights.insights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Insights
          </h4>
          {insights.insights.map((insight, index) => (
            <InsightItemRow key={`${insight.type}-${index}`} insight={insight} />
          ))}
        </div>
      )}

      {hasWarnings && (
        <div className="space-y-2">
          <h4 className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Alertas
          </h4>
          {insights.warnings.map((warning, index) => (
            <WarningItemRow key={`${warning.type}-${index}`} warning={warning} />
          ))}
        </div>
      )}

      {hasProjections && (
        <div>
          <h4 className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide mb-1.5">
            Projeção dos próximos meses
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2">
            {insights.projections.map((projection) => (
              <ProjectionRow key={projection.month} projection={projection} />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/50 dark:border-border-dark/50">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-medium ${confidenceConfig.color}`}>
            {confidenceConfig.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-muted dark:text-text-muted-dark">
            <Clock className="h-2.5 w-2.5" />
            {formatRelativeTime(insights.generatedAt)}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            generateInsights();
          }}
          disabled={isGenerating}
          className="flex items-center gap-1 text-[10px] lg:text-xs font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Analisando...' : 'Atualizar análise'}
        </button>
      </div>
    </>
  );
}

export function resolveInsightsContent(
  isLoading: boolean,
  isNoApiKey: boolean,
  error: unknown,
  insights: CreditCardInsight | undefined,
  generateInsights: () => void,
  isGenerating: boolean,
) {
  if (isLoading) return <InsightsLoadingSkeleton />;
  if (isNoApiKey) return <NoApiKeyState />;
  if (error) return <InsightsErrorState />;
  if (insights) {
    return (
      <InsightsContent
        insights={insights}
        generateInsights={generateInsights}
        isGenerating={isGenerating}
      />
    );
  }
  return null;
}
