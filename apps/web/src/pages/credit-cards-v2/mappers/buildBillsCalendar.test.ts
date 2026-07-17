import { describe, expect, it } from 'vitest';

import type { Transaction } from '@/services/transactionService';

import { buildBillsCalendar } from './buildBillsCalendar';

const JULY_2026 = new Date(2026, 6, 1);

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

describe('buildBillsCalendar', () => {
  it('builds a sunday-aligned grid for the month', () => {
    const calendar = buildBillsCalendar({
      referenceDate: JULY_2026,
      transactions: [],
      closingDays: [],
      dueDates: [],
    });

    expect(calendar.days).toHaveLength(31);
    expect(calendar.leadingDays).toEqual([28, 29, 30]);
    expect(calendar.trailingDays).toEqual([1]);
  });

  it('marks days with registered expenses and installments', () => {
    const calendar = buildBillsCalendar({
      referenceDate: JULY_2026,
      transactions: [
        buildTransaction({ paymentDate: '2026-07-18' }),
        buildTransaction({ paymentDate: '2026-07-20', quantityInstallments: 3 }),
        buildTransaction({ paymentDate: '2026-07-21', launchType: 'revenue' }),
      ],
      closingDays: [],
      dueDates: [],
    });

    const day18 = calendar.days[17];
    const day20 = calendar.days[19];
    const day21 = calendar.days[20];

    expect(day18.hasExpense).toBe(true);
    expect(day18.hasInstallment).toBe(false);
    expect(day20.hasExpense).toBe(true);
    expect(day20.hasInstallment).toBe(true);
    expect(day21.hasExpense).toBe(false);
  });

  it('marks days with refunds and ignores bill payments', () => {
    const calendar = buildBillsCalendar({
      referenceDate: JULY_2026,
      transactions: [
        buildTransaction({
          paymentDate: '2026-07-07',
          launchType: 'revenue',
          description: 'Estorno de compra',
        }),
        buildTransaction({
          paymentDate: '2026-07-01',
          launchType: 'revenue',
          description: 'PAGAMENTO RECEBIDO',
        }),
      ],
      closingDays: [],
      dueDates: [],
    });

    expect(calendar.days[6].hasRefund).toBe(true);
    expect(calendar.days[6].hasExpense).toBe(false);
    expect(calendar.days[0].hasRefund).toBe(false);
  });

  it('marks closing days clamped to the month length', () => {
    const february = new Date(2026, 1, 1);
    const calendar = buildBillsCalendar({
      referenceDate: february,
      transactions: [],
      closingDays: [31, 10],
      dueDates: [],
    });

    expect(calendar.days[27].hasClosing).toBe(true);
    expect(calendar.days[9].hasClosing).toBe(true);
  });

  it('marks due dates that fall inside the month and ignores other months', () => {
    const calendar = buildBillsCalendar({
      referenceDate: JULY_2026,
      transactions: [],
      closingDays: [],
      dueDates: ['2026-07-12', '2026-08-05'],
    });

    expect(calendar.days[11].hasDue).toBe(true);
    expect(calendar.days.filter((day) => day.hasDue)).toHaveLength(1);
  });

  it('ignores transactions from other months', () => {
    const calendar = buildBillsCalendar({
      referenceDate: JULY_2026,
      transactions: [buildTransaction({ paymentDate: '2026-06-18' })],
      closingDays: [],
      dueDates: [],
    });

    expect(calendar.days.every((day) => !day.hasExpense)).toBe(true);
  });
});
