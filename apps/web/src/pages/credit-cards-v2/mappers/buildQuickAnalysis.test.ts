import { describe, expect, it } from 'vitest';

import type { Transaction } from '@/services/transactionService';

import { buildQuickAnalysis } from './buildQuickAnalysis';

const REFERENCE_DATE = new Date(2026, 6, 18);

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `tx-${Math.random().toString(36).slice(2)}`,
    description: 'Expense',
    launchType: 'expense',
    valueType: 'variable',
    companyId: 'company-1',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    value: 100,
    paymentDate: '2026-07-18',
    issueDate: '2026-07-18',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: false,
    createdAt: '2026-07-18T00:00:00Z',
    updatedAt: '2026-07-18T00:00:00Z',
    ...overrides,
  };
}

function spreadDailyExpenses(
  dailyValue: number,
  days: number,
  endDate: Date,
  startOffset = 0,
): Transaction[] {
  const transactions: Transaction[] = [];
  for (let offset = startOffset; offset < startOffset + days; offset += 1) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - offset);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;
    transactions.push(buildTransaction({ value: dailyValue, paymentDate: iso }));
  }
  return transactions;
}

describe('buildQuickAnalysis', () => {
  it('reports spending below the 30-day average when the last 7 days are cheaper', () => {
    const heavyPast = spreadDailyExpenses(100, 23, REFERENCE_DATE, 7);
    const lightWeek = spreadDailyExpenses(10, 7, REFERENCE_DATE);

    const result = buildQuickAnalysis([...heavyPast, ...lightWeek], REFERENCE_DATE);

    expect(result.status).toBe('ready');
    if (result.status === 'ready') {
      expect(result.direction).toBe('below');
      expect(result.percent).toBeGreaterThan(0);
    }
  });

  it('reports spending above the 30-day average when the last 7 days are more expensive', () => {
    const base = spreadDailyExpenses(100, 30, REFERENCE_DATE);
    const expensiveWeek = spreadDailyExpenses(200, 7, REFERENCE_DATE);

    const result = buildQuickAnalysis([...base, ...expensiveWeek], REFERENCE_DATE);

    expect(result.status).toBe('ready');
    if (result.status === 'ready') {
      expect(result.direction).toBe('above');
    }
  });

  it('reports stable spending when both averages match', () => {
    const flat = spreadDailyExpenses(100, 30, REFERENCE_DATE);

    const result = buildQuickAnalysis(flat, REFERENCE_DATE);

    expect(result.status).toBe('ready');
    if (result.status === 'ready') {
      expect(result.direction).toBe('stable');
      expect(result.percent).toBe(0);
    }
  });

  it('is inconclusive when there is no expense in the last 30 days', () => {
    const revenueOnly = [buildTransaction({ launchType: 'revenue', paymentDate: '2026-07-10' })];

    expect(buildQuickAnalysis(revenueOnly, REFERENCE_DATE).status).toBe('inconclusive');
    expect(buildQuickAnalysis([], REFERENCE_DATE).status).toBe('inconclusive');
  });

  it('ignores transactions outside the 30-day window', () => {
    const old = spreadDailyExpenses(1000, 5, new Date(2026, 4, 1));

    expect(buildQuickAnalysis(old, REFERENCE_DATE).status).toBe('inconclusive');
  });
});
