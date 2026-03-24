import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { SKELETON_CARD } from './shared';

interface FormSkeletonProps {
  readonly fields?: number;
  readonly title?: string;
}

export function FormSkeleton({ fields = 5, title }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {title ? <Skeleton className="h-7 w-48" /> : null}

      <div className={`${SKELETON_CARD} p-4 space-y-5`}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={`field-${String(i)}`} className="space-y-2">
            <SkeletonText className="w-24 h-3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
