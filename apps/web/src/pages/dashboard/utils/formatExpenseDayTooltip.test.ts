import { describe, expect, it } from 'vitest';

import { formatCurrency } from '@/utils/formatters';

import { formatExpenseDayTooltip } from './formatExpenseDayTooltip';

describe('formatExpenseDayTooltip', () => {
  it('formats total and singular count', () => {
    expect(formatExpenseDayTooltip(10, 1)).toBe(`${formatCurrency(10)} · 1 despesa`);
  });

  it('formats total and plural count', () => {
    expect(formatExpenseDayTooltip(150.5, 3)).toBe(`${formatCurrency(150.5)} · 3 despesas`);
  });
});
