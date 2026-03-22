import { PLAN_ACCENT, PLAN_ICON } from './constants';

interface PlanBadgeProps {
  readonly planId: string;
  readonly planName: string;
}

export function PlanBadge({ planId, planName }: PlanBadgeProps) {
  const accent = PLAN_ACCENT[planId] ?? PLAN_ACCENT.free;
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${accent.bg} ${accent.text}`}
    >
      <span className={accent.icon}>{PLAN_ICON[planId] ?? PLAN_ICON.free}</span>
      {planName}
    </div>
  );
}
