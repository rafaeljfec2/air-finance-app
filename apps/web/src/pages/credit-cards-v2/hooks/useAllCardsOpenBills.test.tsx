import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as openiService from '@/services/openiService';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

import { useAllCardsOpenBills } from './useAllCardsOpenBills';

vi.mock('@/services/openiService', () => ({
  getCreditCardTransactions: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { readonly children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const emptyPayload = {
  transactions: [],
  total: 0,
  periodStart: null,
  periodEnd: null,
  currentBill: { amount: 0, currency: 'BRL' },
  summary: { totalAmount: 0, totalDebit: 0, totalCredit: 0, currency: 'BRL' },
};

const cards: OpenFinanceCreditCard[] = [
  {
    id: 'acc-1',
    openiCardId: 'openi-1',
    itemId: 'item-1',
    name: 'Card A',
    digits: '4037',
    color: '#8A05BE',
    closingDay: 28,
    dueDay: 5,
  },
];

const REFERENCE_DATE = new Date(2026, 6, 17);

describe('useAllCardsOpenBills', () => {
  beforeEach(() => {
    vi.mocked(openiService.getCreditCardTransactions).mockReset();
  });

  it('projects open bill from sliced history including future installments', async () => {
    vi.mocked(openiService.getCreditCardTransactions).mockImplementation(
      async (_companyId, _itemId, _cardId, _accountId, filters) => {
        const start = filters?.startDate ?? '';
        if (start.startsWith('2026-')) {
          return {
            ...emptyPayload,
            transactions: [
              {
                id: 'm6',
                accountId: 'openi-1',
                billId: null,
                description: 'Mapfre Seguros 6/12',
                descriptionRaw: 'Mapfre Seguros 6/12',
                status: 'POSTED',
                type: 'DEBIT',
                operationType: null,
                amount: 514.7,
                amountInAccountCurrency: null,
                currency: 'BRL',
                cardNumber: null,
                installmentNumber: 6,
                installmentTotal: 12,
                transactionAt: '2026-05-30T12:00:00.000Z',
                updatedAt: '2026-05-30T12:00:00.000Z',
                createdAt: '2026-05-30T12:00:00.000Z',
              },
              {
                id: 'pad',
                accountId: 'openi-1',
                billId: null,
                description: 'Padaria',
                descriptionRaw: 'Padaria',
                status: 'PENDING',
                type: 'DEBIT',
                operationType: null,
                amount: 50,
                amountInAccountCurrency: null,
                currency: 'BRL',
                cardNumber: null,
                installmentNumber: null,
                installmentTotal: null,
                transactionAt: '2026-07-05T12:00:00.000Z',
                updatedAt: '2026-07-05T12:00:00.000Z',
                createdAt: '2026-07-05T12:00:00.000Z',
              },
            ],
          };
        }
        return emptyPayload;
      },
    );

    const { result } = renderHook(() => useAllCardsOpenBills('company-1', cards, REFERENCE_DATE), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.openBillByCardId.size).toBe(1));

    const bill = result.current.openBillByCardId.get('acc-1');
    expect(bill?.cycleAmount).toBe(50);
    expect(bill?.projectedAmount).toBe(514.7);
    expect(bill?.totalEstimated).toBe(564.7);
    expect(bill?.isEstimated).toBe(true);
    expect(bill?.projectedInstallments).toHaveLength(1);
    expect(openiService.getCreditCardTransactions).toHaveBeenCalled();
  });

  it('skips cards without a closing day', async () => {
    const cardsWithoutClosing: OpenFinanceCreditCard[] = [{ ...cards[0]!, closingDay: undefined }];

    const { result } = renderHook(
      () => useAllCardsOpenBills('company-1', cardsWithoutClosing, REFERENCE_DATE),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(openiService.getCreditCardTransactions).not.toHaveBeenCalled();
    expect(result.current.openBillByCardId.size).toBe(0);
  });
});
