import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/components/insights/InsightRenderers';
import type { InsightItem } from '@/services/agentService';

interface EvidenceCardProps {
  readonly insight: InsightItem;
}

const SEVERITY_BORDER = {
  info: 'border-l-blue-400 dark:border-l-blue-500',
  warning: 'border-l-amber-400 dark:border-l-amber-500',
  critical: 'border-l-red-400 dark:border-l-red-500',
} as const;

const SEVERITY_DOT = {
  info: 'bg-blue-400 dark:bg-blue-500',
  warning: 'bg-amber-400 dark:bg-amber-500',
  critical: 'bg-red-400 dark:bg-red-500',
} as const;

function getCtaConfig(type: string): { label: string; path: string } {
  switch (type) {
    case 'SPENDING_PATTERN':
      return { label: 'Ver transações', path: '/transactions' };
    case 'LIMIT_USAGE':
      return { label: 'Ver limite', path: '/credit-cards/bills' };
    case 'INSTALLMENT_IMPACT':
      return { label: 'Ver parcelas', path: '/credit-cards/bills' };
    case 'BILL_COMPOSITION':
      return { label: 'Ver fatura', path: '/credit-cards/bills' };
    case 'CATEGORY_ANALYSIS':
      return { label: 'Ver categorias', path: '/categories' };
    case 'TREND_COMPARISON':
      return { label: 'Ver histórico', path: '/reports' };
    default:
      return { label: 'Ver detalhes', path: '/credit-cards/bills' };
  }
}

export function EvidenceCard({ insight }: EvidenceCardProps) {
  const navigate = useNavigate();
  const cta = getCtaConfig(insight.type);
  const hasValue = insight.value != null;

  return (
    <div
      className={`
        rounded-xl border border-border dark:border-border-dark
        border-l-2 ${SEVERITY_BORDER[insight.severity]}
        bg-card dark:bg-card-dark p-4 lg:p-5
        transition-shadow hover:ring-1 hover:ring-border dark:hover:ring-border-dark
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {hasValue && (
            <p className="text-xl font-bold text-text dark:text-text-dark tabular-nums">
              {formatCurrency(insight.value!)}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${SEVERITY_DOT[insight.severity]}`}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
              {insight.title}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted dark:text-text-muted-dark leading-normal mt-2">
        {insight.description}
      </p>

      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={() => navigate(cta.path)}
          className="inline-flex items-center gap-1 text-xs font-medium text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors"
        >
          {cta.label}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
