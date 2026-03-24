import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { SKELETON_CARD } from './shared';

interface DetailSkeletonProps {
  readonly sections?: number;
  readonly title?: string;
}

export function DetailSkeleton({ sections = 3, title }: DetailSkeletonProps) {
  return (
    <div className="space-y-6">
      {title ? <Skeleton className="h-7 w-48" /> : null}

      <div className={`${SKELETON_CARD} p-4 space-y-4`}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-2/5" />
            <SkeletonText className="w-1/3" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`stat-${String(i)}`} className="space-y-2">
              <SkeletonText className="w-1/2 h-2.5" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {Array.from({ length: sections }).map((_, sIdx) => (
        <div key={`sec-${String(sIdx)}`} className={`${SKELETON_CARD} p-4 space-y-3`}>
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`item-${String(i)}`} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <SkeletonText className={i % 2 === 0 ? 'w-3/4' : 'w-5/6'} />
                <Skeleton className="h-4 w-16 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
