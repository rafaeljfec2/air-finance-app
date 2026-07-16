import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TimelineInfiniteLoaderProps {
  readonly hasMore: boolean;
  readonly onLoadMore: () => void;
}

export function TimelineInfiniteLoader({
  hasMore,
  onLoadMore,
}: Readonly<TimelineInfiniteLoaderProps>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return undefined;

    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  if (!hasMore) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      className="flex items-center justify-center gap-2 py-4 text-xs text-text-muted dark:text-text-muted-dark"
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      Carregando próximos dias...
    </div>
  );
}
