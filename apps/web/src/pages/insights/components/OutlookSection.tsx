import { useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { formatCurrency, type DecisionState } from '@/components/insights/InsightRenderers';
import type { ProjectionItem } from '@/services/agentService';

interface OutlookSectionProps {
  readonly projections: readonly ProjectionItem[];
  readonly state: DecisionState;
}

function confidenceToOpacity(confidence: number): number {
  if (confidence >= 0.8) return 1;
  if (confidence >= 0.5) return 0.75;
  if (confidence >= 0.3) return 0.5;
  return 0.3;
}

function formatMonth(monthStr: string): string {
  try {
    const [year, month] = monthStr.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  } catch {
    return monthStr;
  }
}

function formatDelta(current: number, previous: number): { text: string; color: string } | null {
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 1) return null;
  const sign = pct > 0 ? '+' : '';
  return {
    text: `${sign}${pct.toFixed(0)}%`,
    color: pct > 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
  };
}

interface ProjectionBarProps {
  readonly projection: ProjectionItem;
  readonly maxValue: number;
  readonly previousTotal?: number;
}

function ProjectionBar({ projection, maxValue, previousTotal }: ProjectionBarProps) {
  const ratio = maxValue > 0 ? (projection.projectedTotal / maxValue) * 100 : 0;
  const opacity = confidenceToOpacity(projection.confidence);
  const delta =
    previousTotal === undefined ? null : formatDelta(projection.projectedTotal, previousTotal);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark capitalize">
          {formatMonth(projection.month)}
        </span>
        <div className="flex items-center gap-2">
          {delta && (
            <span className={`text-[11px] font-semibold tabular-nums ${delta.color}`}>
              {delta.text}
            </span>
          )}
          <span className="text-sm font-semibold text-text dark:text-text-dark tabular-nums">
            {formatCurrency(projection.projectedTotal)}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-violet-500 dark:bg-violet-400 transition-all duration-500"
          style={{ width: `${ratio}%`, opacity }}
        />
      </div>
    </div>
  );
}

export function OutlookSection({ projections, state }: OutlookSectionProps) {
  const [isExpanded, setIsExpanded] = useState(state !== 'all-clear');

  if (projections.length === 0) return null;

  const maxValue = Math.max(...projections.map((p) => p.projectedTotal));
  const firstProjection = projections[0];
  const isCondensed = state === 'all-clear' && !isExpanded;

  return (
    <div className="py-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Previsão de gastos
        </h3>
      </div>

      {isCondensed ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark capitalize">
              {formatMonth(firstProjection.month)}
            </span>
            <span className="text-sm font-semibold text-text dark:text-text-dark tabular-nums">
              {formatCurrency(firstProjection.projectedTotal)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-text-muted dark:text-text-muted-dark">
            {projections.length > 1 && `+${projections.length - 1} meses`}
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </button>
      ) : (
        <div className="space-y-3">
          {projections.map((projection, index) => (
            <ProjectionBar
              key={projection.month}
              projection={projection}
              maxValue={maxValue}
              previousTotal={index > 0 ? projections[index - 1].projectedTotal : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
