import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useProgressiveReveal } from './useProgressiveReveal';

describe('useProgressiveReveal', () => {
  it('starts with the initial chunk visible', () => {
    const { result } = renderHook(() =>
      useProgressiveReveal({ totalCount: 100, chunkSize: 20, resetKey: 'a' }),
    );

    expect(result.current.visibleCount).toBe(20);
    expect(result.current.hasMore).toBe(true);
  });

  it('reveals more items per chunk until reaching the total', () => {
    const { result } = renderHook(() =>
      useProgressiveReveal({ totalCount: 45, chunkSize: 20, resetKey: 'a' }),
    );

    act(() => result.current.revealMore());
    expect(result.current.visibleCount).toBe(40);
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.revealMore());
    expect(result.current.visibleCount).toBe(45);
    expect(result.current.hasMore).toBe(false);
  });

  it('caps the visible count when total is smaller than a chunk', () => {
    const { result } = renderHook(() =>
      useProgressiveReveal({ totalCount: 5, chunkSize: 20, resetKey: 'a' }),
    );

    expect(result.current.visibleCount).toBe(5);
    expect(result.current.hasMore).toBe(false);
  });

  it('resets to the first chunk when resetKey changes', () => {
    const { result, rerender } = renderHook(
      ({ resetKey }) => useProgressiveReveal({ totalCount: 100, chunkSize: 20, resetKey }),
      { initialProps: { resetKey: 'a' } },
    );

    act(() => result.current.revealMore());
    expect(result.current.visibleCount).toBe(40);

    rerender({ resetKey: 'b' });
    expect(result.current.visibleCount).toBe(20);
  });
});
