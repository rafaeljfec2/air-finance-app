import { formatCurrency } from '@/utils/formatters';

import type { PeriodReadingProjectionMilestone } from '../../mappers/buildPeriodReadingProjectionMilestones';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface PeriodReadingProjectionProps {
  readonly milestones: readonly PeriodReadingProjectionMilestone[];
}

interface CurvePoint {
  readonly x: number;
  readonly y: number;
}

/** Normalized curve coordinates (percentages of the drawing area). */
function buildCurvePoints(milestones: readonly PeriodReadingProjectionMilestone[]): CurvePoint[] {
  const values = milestones.map((m) => m.committedPct);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  return milestones.map((milestone, index) => {
    const x = milestones.length === 1 ? 50 : 4 + (index / (milestones.length - 1)) * 88;
    const yNorm = range === 0 ? 0.5 : 1 - (milestone.committedPct - min) / range;
    return { x, y: 12 + yNorm * 68 };
  });
}

/** Smooth path with horizontal tangents at each point. */
function buildCurvePath(points: readonly CurvePoint[]): string {
  if (points.length === 0) {
    return '';
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function MilestoneText({ milestone }: Readonly<{ milestone: PeriodReadingProjectionMilestone }>) {
  return (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {milestone.label}
      </p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums leading-none text-text dark:text-text-dark">
        {Math.round(milestone.committedPct * 100)}%
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">da renda</p>
      <p className="mt-1 text-xs tabular-nums text-muted-foreground">
        {formatCurrency(milestone.totalCommitted)}/mês
      </p>
    </>
  );
}

export function PeriodReadingProjection({ milestones }: Readonly<PeriodReadingProjectionProps>) {
  const points = buildCurvePoints(milestones);
  const path = buildCurvePath(points);

  return (
    <section
      aria-label="Como sua situação evolui seguindo o plano"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader
        number={4}
        title="Como sua situação evolui seguindo o plano"
        description="Projeção do comprometimento já calculada pelo complete-plan."
      />

      <div className="relative hidden h-56 sm:block" aria-hidden>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-24 w-full"
        >
          <path
            d={path}
            fill="none"
            stroke="#10b981"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        </svg>
        {points.map((point, index) => {
          const milestone = milestones[index];
          const dotTop = (point.y / 100) * 96;
          return (
            <div key={milestone.id}>
              <span
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"
                style={{ left: `${point.x}%`, top: `${dotTop}px` }}
              />
              <div
                className="absolute w-32 -translate-x-1"
                style={{ left: `${point.x}%`, top: `${dotTop + 16}px` }}
              >
                <MilestoneText milestone={milestone} />
              </div>
            </div>
          );
        })}
      </div>

      <ol className="grid grid-cols-2 gap-4 sm:sr-only">
        {milestones.map((milestone) => (
          <li key={milestone.id}>
            <MilestoneText milestone={milestone} />
          </li>
        ))}
      </ol>
    </section>
  );
}
