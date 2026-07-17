import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDashboardPeriod } from './useDashboardPeriod';

describe('useDashboardPeriod', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 16, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at the current month with month filters', () => {
    const { result } = renderHook(() => useDashboardPeriod());

    expect(result.current.monthLabel).toBe('Julho de 2026');
    expect(result.current.filters.timeRange).toBe('month');
    expect(new Date(result.current.filters.referenceDate ?? '').getMonth()).toBe(6);
    expect(result.current.isCurrentMonth).toBe(true);
  });

  it('navigates to the previous month', () => {
    const { result } = renderHook(() => useDashboardPeriod());

    act(() => result.current.goToPreviousMonth());

    expect(result.current.monthLabel).toBe('Junho de 2026');
    expect(result.current.isCurrentMonth).toBe(false);
  });

  it('navigates forward but never beyond the current month', () => {
    const { result } = renderHook(() => useDashboardPeriod());

    act(() => result.current.goToPreviousMonth());
    act(() => result.current.goToNextMonth());
    expect(result.current.monthLabel).toBe('Julho de 2026');

    act(() => result.current.goToNextMonth());
    expect(result.current.monthLabel).toBe('Julho de 2026');
  });

  it('crosses year boundaries when going back', () => {
    const { result } = renderHook(() => useDashboardPeriod());

    for (let i = 0; i < 7; i += 1) {
      act(() => result.current.goToPreviousMonth());
    }

    expect(result.current.monthLabel).toBe('Dezembro de 2025');
  });
});
