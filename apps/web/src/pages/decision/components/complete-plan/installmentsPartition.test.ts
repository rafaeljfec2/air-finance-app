import { describe, expect, it } from 'vitest';

import {
  INSTALLMENTS_VISIBLE_HIGH_MEDIUM_MAX,
  partitionInstallmentsHeadAndRest,
} from './installmentsPartition';

describe('partitionInstallmentsHeadAndRest', () => {
  it('keeps first three high or medium items in head in list order', () => {
    const items = [
      {
        description: 'L1',
        monthlyValue: 1,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'a',
        accountType: 'other' as const,
        categoryId: null,
        priority: 'low' as const,
      },
      {
        description: 'H1',
        monthlyValue: 2,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'b',
        accountType: 'credit_card' as const,
        categoryId: null,
        priority: 'high' as const,
      },
      {
        description: 'M1',
        monthlyValue: 3,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'c',
        accountType: 'credit_card' as const,
        categoryId: null,
        priority: 'medium' as const,
      },
      {
        description: 'H2',
        monthlyValue: 4,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'd',
        accountType: 'credit_card' as const,
        categoryId: null,
        priority: 'high' as const,
      },
      {
        description: 'M2',
        monthlyValue: 5,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'e',
        accountType: 'credit_card' as const,
        categoryId: null,
        priority: 'medium' as const,
      },
    ];
    const { head, rest } = partitionInstallmentsHeadAndRest(items);
    expect(head).toHaveLength(INSTALLMENTS_VISIBLE_HIGH_MEDIUM_MAX);
    expect(head.map((x) => x.description)).toEqual(['H1', 'M1', 'H2']);
    expect(rest.map((x) => x.description)).toEqual(['L1', 'M2']);
  });

  it('puts all items in rest when none are high or medium', () => {
    const items = [
      {
        description: 'A',
        monthlyValue: 1,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'a',
        accountType: 'other' as const,
        categoryId: null,
        priority: 'low' as const,
      },
      {
        description: 'B',
        monthlyValue: 2,
        remaining: 1,
        endDate: '2026-01-01',
        accountId: 'b',
        accountType: 'other' as const,
        categoryId: null,
        priority: 'low' as const,
      },
    ];
    const { head, rest } = partitionInstallmentsHeadAndRest(items);
    expect(head).toHaveLength(0);
    expect(rest).toHaveLength(2);
  });
});
