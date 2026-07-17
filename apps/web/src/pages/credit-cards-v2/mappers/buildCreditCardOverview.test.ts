import { describe, expect, it } from 'vitest';

import type { OpeniCreditCardDetailsPayload } from '@/services/openiService';

import { buildCreditCardOverview } from './buildCreditCardOverview';
import type { OpenFinanceCreditCard } from './mapAccountToOpenFinanceCreditCard';
import type { OpenBillProjection } from './projectInstallmentsForOpenBill';

const REFERENCE_DATE = new Date(2026, 6, 17);

function buildCard(overrides: Partial<OpenFinanceCreditCard> = {}): OpenFinanceCreditCard {
  return {
    id: 'acc-1',
    openiCardId: 'openi-1',
    itemId: 'item-1',
    name: 'ultraviolet+black',
    digits: '4037',
    status: 'CONNECTED',
    color: '#8A05BE',
    closingDay: 1,
    dueDay: 6,
    ...overrides,
  };
}

function buildDetails(
  overrides: Partial<OpeniCreditCardDetailsPayload> = {},
): OpeniCreditCardDetailsPayload {
  return {
    id: 'openi-1',
    name: 'ultraviolet+black',
    digits: '4037',
    brand: 'MASTERCARD',
    level: 'BLACK',
    status: 'ACTIVE',
    currency: 'BRL',
    holderType: null,
    limitTotal: 20000,
    limitUsed: 11067.92,
    limitAvailable: 8932.08,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-18T00:00:00Z',
    limits: [],
    bills: [],
    ...overrides,
  };
}

function buildBill(id: string, amount: number, dueDate: string) {
  return {
    id,
    amount,
    currency: 'BRL',
    minimumPayment: amount * 0.15,
    allowsInstallments: true,
    dueDate,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-18T00:00:00Z',
  };
}

function buildOpenBill(totalEstimated: number): OpenBillProjection {
  return {
    cycleAmount: totalEstimated,
    projectedAmount: 0,
    totalEstimated,
    projectedInstallments: [],
    isEstimated: false,
  };
}

describe('buildCreditCardOverview', () => {
  it('uses the projected open bill total and calculates the open due date', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: buildDetails({
        bills: [
          buildBill('bill-jul', 14228.96, '2026-07-06'),
          buildBill('bill-jun', 13422.9, '2026-06-08'),
        ],
      }),
      openBill: {
        cycleAmount: 200,
        projectedAmount: 105.95,
        totalEstimated: 305.95,
        projectedInstallments: [
          {
            id: 'p1',
            description: 'Mapfre',
            amount: 105.95,
            installmentLabel: '7/12',
            purchaseDate: '2026-05-30',
          },
        ],
        isEstimated: true,
      },
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.currentBillAmount).toBe(305.95);
    expect(overview.cycleBillAmount).toBe(200);
    expect(overview.projectedInstallmentsAmount).toBe(105.95);
    expect(overview.isBillEstimated).toBe(true);
    expect(overview.sourceFreshnessLabel).toBeNull();
    expect(overview.projectedInstallments).toHaveLength(1);
    expect(overview.currentBillDueDate).toBe('2026-08-06');
    expect(overview.lastClosedBillId).toBe('bill-jul');
    expect(overview.lastClosedBillAmount).toBe(14228.96);
    expect(overview.lastClosedBillDueDate).toBe('2026-07-06');
  });

  it('never falls back to a closed bill when the open amount is still loading', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: buildDetails({
        bills: [buildBill('bill-jul', 14228.96, '2026-07-06')],
      }),
      openBill: null,
      referenceDate: REFERENCE_DATE,
      sourceState: {
        mode: 'COMBINED',
        ofxReconciledUntil: '2026-07-17T12:00:00.000Z',
      },
    });

    expect(overview.currentBillAmount).toBeNull();
    expect(overview.sourceFreshnessLabel).toBe(
      'Extrato importado em 17/07/2026 + gastos recentes do banco',
    );
    expect(overview.cycleBillAmount).toBeNull();
    expect(overview.isBillEstimated).toBe(false);
    expect(overview.currentBillDueDate).toBe('2026-08-06');
    expect(overview.lastClosedBillAmount).toBe(14228.96);
  });

  it('picks the most recent past bill as the last closed bill', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: buildDetails({
        bills: [
          buildBill('bill-sep', 500, '2026-09-05'),
          buildBill('bill-jul', 950, '2026-07-05'),
          buildBill('bill-jun', 800, '2026-06-05'),
        ],
      }),
      openBill: buildOpenBill(100),
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.lastClosedBillId).toBe('bill-jul');
    expect(overview.lastClosedBillAmount).toBe(950);
    expect(overview.lastClosedBillDueDate).toBe('2026-07-05');
  });

  it('returns null closed bill data when there are no past bills', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: buildDetails({ bills: [] }),
      openBill: buildOpenBill(50),
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.lastClosedBillId).toBeNull();
    expect(overview.lastClosedBillAmount).toBeNull();
    expect(overview.lastClosedBillDueDate).toBeNull();
  });

  it('computes the next closing date from the account closing day', () => {
    const overview = buildCreditCardOverview({
      card: buildCard({ closingDay: 28 }),
      details: buildDetails(),
      openBill: null,
      referenceDate: new Date(2026, 6, 18),
    });

    expect(overview.nextClosingDate).toBe('2026-07-28');
  });

  it('rolls the closing date to the next month when the closing day already passed', () => {
    const overview = buildCreditCardOverview({
      card: buildCard({ closingDay: 10 }),
      details: buildDetails(),
      openBill: null,
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.nextClosingDate).toBe('2026-08-10');
  });

  it('clamps the closing day to the last day of shorter months', () => {
    const overview = buildCreditCardOverview({
      card: buildCard({ closingDay: 31 }),
      details: buildDetails(),
      openBill: null,
      referenceDate: new Date(2026, 1, 15),
    });

    expect(overview.nextClosingDate).toBe('2026-02-28');
  });

  it('returns null closing date when the account has no closing day', () => {
    const overview = buildCreditCardOverview({
      card: buildCard({ closingDay: undefined }),
      details: buildDetails(),
      openBill: null,
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.nextClosingDate).toBeNull();
    expect(overview.currentBillDueDate).toBeNull();
  });

  it('exposes limits and rounded usage percent', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: buildDetails({ limitTotal: 34500, limitUsed: 5412.23, limitAvailable: 29087.77 }),
      openBill: null,
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.limitTotal).toBe(34500);
    expect(overview.limitUsed).toBe(5412.23);
    expect(overview.limitAvailable).toBe(29087.77);
    expect(overview.usagePercent).toBe(16);
  });

  it('returns null usage percent when the limit total is zero', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: buildDetails({ limitTotal: 0, limitUsed: 0, limitAvailable: 0 }),
      openBill: null,
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.usagePercent).toBeNull();
  });

  it('marks connected and syncing cards as active', () => {
    for (const status of ['CONNECTED', 'SYNCED', 'SYNCING']) {
      const overview = buildCreditCardOverview({
        card: buildCard({ status }),
        details: buildDetails(),
        openBill: null,
        referenceDate: REFERENCE_DATE,
      });
      expect(overview.isActive).toBe(true);
    }
  });

  it('treats cards without an explicit status as active (legacy Open Finance shape)', () => {
    const overview = buildCreditCardOverview({
      card: buildCard({ status: undefined }),
      details: buildDetails(),
      openBill: null,
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.isActive).toBe(true);
  });

  it('marks cards with an error status as inactive', () => {
    for (const status of ['ERROR', 'DISCONNECTED', 'LOGIN_ERROR', 'OUTDATED']) {
      const overview = buildCreditCardOverview({
        card: buildCard({ status }),
        details: buildDetails(),
        openBill: null,
        referenceDate: REFERENCE_DATE,
      });
      expect(overview.isActive).toBe(false);
    }
  });

  it('keeps limits and bill null when details were not loaded yet', () => {
    const overview = buildCreditCardOverview({
      card: buildCard(),
      details: null,
      openBill: null,
      referenceDate: REFERENCE_DATE,
    });

    expect(overview.currentBillAmount).toBeNull();
    expect(overview.lastClosedBillId).toBeNull();
    expect(overview.limitTotal).toBeNull();
    expect(overview.limitUsed).toBeNull();
    expect(overview.limitAvailable).toBeNull();
    expect(overview.usagePercent).toBeNull();
    expect(overview.nextClosingDate).toBe('2026-08-01');
  });
});
