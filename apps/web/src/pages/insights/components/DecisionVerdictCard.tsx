import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import {
  CONFIDENCE_STYLES,
  formatRelativeTime,
  type DecisionState,
} from '@/components/insights/InsightRenderers';
import type { CreditCardInsight } from '@/services/agentService';

interface DecisionVerdictCardProps {
  readonly insights: CreditCardInsight;
  readonly state: DecisionState;
  readonly onScrollToEvidence?: () => void;
}

const VERDICT_CONFIG = {
  'all-clear': {
    badge: 'Tudo certo',
    decision: 'Tudo sob controle.',
    gradient: 'from-emerald-500/5 via-transparent to-transparent dark:from-emerald-500/10',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    icon: CheckCircle2,
    border: '',
  },
  attention: {
    badge: 'Atenção',
    decision: 'Revise antes do vencimento.',
    gradient: 'from-amber-500/5 via-transparent to-transparent dark:from-amber-500/10',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-700 dark:text-amber-400',
    icon: AlertTriangle,
    border: '',
  },
  risk: {
    badge: 'Ação recomendada',
    decision: 'Ação necessária agora.',
    gradient: 'from-red-500/5 via-transparent to-transparent dark:from-red-500/10',
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-700 dark:text-red-400',
    icon: ShieldAlert,
    border: 'border-l-2 border-l-red-400 dark:border-l-red-500',
  },
} as const;

function splitSummary(summary: string): { statusLine: string; rest: string } {
  const match = /^(.+?[.!])(\s+.*)?$/s.exec(summary);
  if (match) {
    return { statusLine: match[1].trim(), rest: match[2]?.trim() ?? '' };
  }
  return { statusLine: summary, rest: '' };
}

export function DecisionVerdictCard({
  insights,
  state,
  onScrollToEvidence,
}: DecisionVerdictCardProps) {
  const config = VERDICT_CONFIG[state];
  const confidenceConfig = CONFIDENCE_STYLES[insights.confidenceLevel];
  const Icon = config.icon;
  const { statusLine, rest } = splitSummary(insights.summary);

  return (
    <div
      className={`
        relative rounded-2xl p-5 lg:p-7 backdrop-blur-sm
        bg-gradient-to-br ${config.gradient}
        ${config.border}
      `}
    >
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.badgeBg} mb-3`}
      >
        <Icon className={`h-3 w-3 ${config.badgeText}`} />
        <span className={`text-[11px] font-semibold ${config.badgeText}`}>{config.badge}</span>
      </div>

      <p className="text-sm font-medium text-text dark:text-text-dark leading-normal mb-1">
        {statusLine}
      </p>

      {rest && (
        <p className="text-xs text-text-muted dark:text-text-muted-dark leading-normal mb-3">
          {rest}
        </p>
      )}

      <p className="text-base lg:text-lg font-bold text-text dark:text-text-dark leading-normal">
        {config.decision}
      </p>

      {state !== 'all-clear' && onScrollToEvidence && (
        <button
          type="button"
          onClick={onScrollToEvidence}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-text dark:bg-text-dark text-card dark:text-card-dark hover:opacity-90 transition-opacity"
        >
          {state === 'risk' ? 'Ver o que fazer' : 'Revisar agora'}
        </button>
      )}

      <div className="flex items-center gap-2 mt-4 text-[11px] text-text-muted dark:text-text-muted-dark">
        <span>{formatRelativeTime(insights.generatedAt)}</span>
        <span>·</span>
        <span className={confidenceConfig.color}>{confidenceConfig.label}</span>
      </div>
    </div>
  );
}
