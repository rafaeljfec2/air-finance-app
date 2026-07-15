import { describe, expect, it } from 'vitest';

import type { Account } from '@/services/accountService';
import type { CreditCard, Receivable } from '@/types/budget';

import { deriveBriefingFacts } from './deriveBriefingFacts';

function account(partial: Partial<Account> & Pick<Account, 'id' | 'name' | 'type'>): Account {
  return {
    color: '#000000',
    icon: 'wallet',
    currentBalance: 0,
    companyId: 'c1',
    ...partial,
  } as Account;
}

describe('deriveBriefingFacts', () => {
  it('sums checking and savings as operational cash and picks anchor receivable', () => {
    const accounts = [
      account({ id: '1', name: 'Corrente', type: 'checking', currentBalance: 30 }),
      account({ id: '2', name: 'Poupança', type: 'savings', currentBalance: 14 }),
      account({ id: '3', name: 'Cartão', type: 'credit_card', currentBalance: -10000 }),
    ];
    const receivables: Receivable[] = [
      {
        id: 'r1',
        description: 'OUTSERA',
        value: 21751.2,
        dueDate: '2026-07-20T12:00:00.000Z',
        status: 'PENDING',
      },
      {
        id: 'r2',
        description: 'OABPREV',
        value: 500,
        dueDate: '2026-07-10T12:00:00.000Z',
        status: 'PENDING',
      },
    ];
    const creditCards: CreditCard[] = [
      {
        id: 'uv',
        accountId: 'a1',
        name: 'ultraviolet-black MASTERCARD',
        brand: 'nubank',
        limit: 25000,
        bills: [
          {
            id: 'b1',
            cardId: 'uv',
            month: '2026-07',
            total: 11066.48,
            dueDate: '2026-07-25',
            status: 'OPEN',
            transactions: [],
          },
        ],
      },
      {
        id: 'sig',
        accountId: 'a2',
        name: 'Signature',
        brand: 'itau',
        limit: 40000,
        bills: [
          {
            id: 'b2',
            cardId: 'sig',
            month: '2026-07',
            total: 0,
            dueDate: '2026-07-25',
            status: 'OPEN',
            transactions: [],
          },
        ],
      },
    ];

    const facts = deriveBriefingFacts({
      accounts,
      receivables,
      creditCards,
      cashFlow: {
        month: '2026-07',
        initialBalance: 0,
        totalIncome: 26706,
        totalExpense: 22874,
        currentBalance: 3832,
        finalBalance: 3832,
      },
    });

    expect(facts.operationalCash).toBe(44);
    expect(facts.projectedMonthBalance).toBe(3832);
    expect(facts.anchorReceivable?.label).toBe('OUTSERA');
    expect(facts.anchorReceivable?.dueDay).toBe(20);
    expect(facts.operatingCardName).toMatch(/ultraviolet/i);
    expect(facts.operatingCardBillTotal).toBeCloseTo(11066.48);
    expect(facts.idleCardName).toMatch(/Signature/i);
  });
});
