import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useExpenseCalendarMonth } from './useExpenseCalendarMonth';

describe('useExpenseCalendarMonth', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 16, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at the dashboard month when provided', () => {
    const { result } = renderHook(() =>
      useExpenseCalendarMonth(new Date(2026, 5, 1).toISOString()),
    );

    expect(result.current.monthLabel).toBe('Junho de 2026');
    expect(result.current.isCurrentMonth).toBe(false);
    expect(new Date(result.current.filters.referenceDate ?? '').getMonth()).toBe(5);
  });

  it('falls back to the current month when no initial month is provided', () => {
    const { result } = renderHook(() => useExpenseCalendarMonth());

    expect(result.current.monthLabel).toBe('Julho de 2026');
    expect(result.current.isCurrentMonth).toBe(true);
  });

  it('navigates independently without exceeding the current month', () => {
    const { result } = renderHook(() =>
      useExpenseCalendarMonth(new Date(2026, 6, 1).toISOString()),
    );

    act(() => result.current.goToPreviousMonth());
    expect(result.current.monthLabel).toBe('Junho de 2026');

    act(() => result.current.goToNextMonth());
    expect(result.current.monthLabel).toBe('Julho de 2026');

    act(() => result.current.goToNextMonth());
    expect(result.current.monthLabel).toBe('Julho de 2026');
  });
});
