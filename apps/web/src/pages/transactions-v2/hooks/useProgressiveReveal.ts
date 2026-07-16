import { useCallback, useEffect, useRef, useState } from 'react';

interface UseProgressiveRevealOptions {
  readonly totalCount: number;
  readonly chunkSize?: number;
  readonly resetKey?: string;
}

interface UseProgressiveRevealResult {
  readonly visibleCount: number;
  readonly hasMore: boolean;
  readonly revealMore: () => void;
}

const DEFAULT_CHUNK_SIZE = 20;

export function useProgressiveReveal({
  totalCount,
  chunkSize = DEFAULT_CHUNK_SIZE,
  resetKey,
}: UseProgressiveRevealOptions): UseProgressiveRevealResult {
  const [revealedCount, setRevealedCount] = useState(chunkSize);
  const previousResetKeyRef = useRef(resetKey);

  useEffect(() => {
    if (previousResetKeyRef.current !== resetKey) {
      previousResetKeyRef.current = resetKey;
      setRevealedCount(chunkSize);
    }
  }, [resetKey, chunkSize]);

  const visibleCount = Math.min(revealedCount, totalCount);
  const hasMore = visibleCount < totalCount;

  const revealMore = useCallback(() => {
    setRevealedCount((current) => current + chunkSize);
  }, [chunkSize]);

  return { visibleCount, hasMore, revealMore };
}
