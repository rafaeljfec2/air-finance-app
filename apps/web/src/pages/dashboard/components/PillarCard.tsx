import {
  Activity,
  CreditCard,
  Droplets,
  Landmark,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Pill } from '../laudo-layout/primitives';
import type { CapacityState, FinancialHealthPillar, PillarId } from '../types';
import { CAPACITY_STATE_LABEL } from '../types';

const PILLAR_ICONS: Record<PillarId, LucideIcon> = {
  liquidity: Droplets,
  flow: Activity,
  structure: Layers,
  credit: CreditCard,
  resilience: ShieldCheck,
  wealth: Landmark,
};

const ICON_TONE: Record<PillarId, string> = {
  liquidity:
    'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:border-sky-400/40 dark:text-sky-300',
  flow: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/40 dark:text-emerald-300',
  structure:
    'border-violet-500/40 bg-violet-500/10 text-violet-600 dark:border-violet-400/40 dark:text-violet-300',
  credit:
    'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:border-amber-400/40 dark:text-amber-300',
  resilience:
    'border-teal-500/40 bg-teal-500/10 text-teal-600 dark:border-teal-400/40 dark:text-teal-300',
  wealth:
    'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:border-rose-400/40 dark:text-rose-300',
};

function stateTone(state: CapacityState): 'neutral' | 'info' | 'warning' | 'success' | 'danger' {
  switch (state) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'attention':
      return 'warning';
    case 'critical':
      return 'danger';
    case 'inconclusive':
      return 'info';
    default:
      return 'neutral';
  }
}

interface PillarCardProps {
  readonly pillar: FinancialHealthPillar;
  readonly onExplore: () => void;
}

export function PillarCard({ pillar, onExplore }: PillarCardProps) {
  const Icon = PILLAR_ICONS[pillar.id];

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm dark:border-border-dark dark:bg-card-dark">
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
            ICON_TONE[pillar.id],
          )}
          aria-hidden
        >
          <Icon size={18} />
        </span>
        <Pill tone={stateTone(pillar.state)}>{CAPACITY_STATE_LABEL[pillar.state]}</Pill>
      </div>

      <h3 className="mt-3 text-sm font-semibold tracking-tight text-text dark:text-text-dark">
        {pillar.name}
      </h3>

      <p className="mt-1.5 truncate text-xl font-bold tabular-nums tracking-tight text-text dark:text-text-dark">
        {pillar.primaryFormatted ?? '—'}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{pillar.primaryLabel}</p>

      <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {pillar.question}
      </p>

      <button
        type="button"
        onClick={onExplore}
        className="mt-3 inline-flex min-h-[32px] items-center gap-1 self-start text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-300 dark:hover:text-primary-200"
      >
        Explorar
        <span aria-hidden>→</span>
      </button>
    </article>
  );
}
