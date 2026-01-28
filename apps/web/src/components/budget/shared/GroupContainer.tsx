import type { ReactNode } from 'react';

type ColorVariant = 'emerald' | 'amber' | 'rose' | 'violet' | 'gray';

interface GroupContainerProps {
  readonly color: ColorVariant;
  readonly children: ReactNode;
}

const colorClasses: Record<ColorVariant, string> = {
  emerald: 'border-emerald-500/20 bg-emerald-500/5',
  amber: 'border-amber-500/20 bg-amber-500/5',
  rose: 'border-rose-500/20 bg-rose-500/5',
  violet: 'border-violet-500/20 bg-violet-500/5',
  gray: 'border-border dark:border-border-dark',
};

export function GroupContainer({ color, children }: GroupContainerProps) {
  return (
    <div className={`rounded-lg border overflow-hidden ${colorClasses[color]}`}>{children}</div>
  );
}
