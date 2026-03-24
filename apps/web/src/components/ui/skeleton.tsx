import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('animate-shimmer rounded-md', className)} style={style} />
  );
}

export function SkeletonText({ className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-shimmer h-3 w-3/4 rounded', className)}
      style={style}
    />
  );
}
