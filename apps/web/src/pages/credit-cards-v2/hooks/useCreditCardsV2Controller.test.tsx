import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';
import type { OpenFinanceBillView } from '../mappers/mapOpeniBillsToView';
import type { StatementTransactionItem } from '../mappers/mapOpeniTransactionToStatementItem';

import { useCreditCardsV2Controller } from './useCreditCardsV2Controller';

const card: OpenFinanceCreditCard = {
  id: 'mongo-1',
  openiCardId: 'openi-1',
  itemId: 'item-1',
  name: 'OF Card',
  digits: '1234',
  color: '#8A05BE',
};

const bills: OpenFinanceBillView[] = [
  {
    id: 'bill-old',
    amount: 500,
    currency: 'BRL',
    minimumPayment: 50,
    allowsInstallments: false,
    dueDate: '2025-11-10',
  },
];

const rawTransactions: StatementTransactionItem[] = [
  {
    id: 'tx-1',
    date: '2025-10-01',
    description: 'On bill',
    amount: -100,
    type: 'DEBIT',
    status: 'POSTED',
    billId: 'bill-old',
  },
  {
    id: 'tx-2',
    date: '2025-10-02',
    description: 'Other bill',
    amount: -50,
    type: 'DEBIT',
    status: 'POSTED',
    billId: 'other',
  },
];

const mockUseOpenFinanceCreditCards = vi.fn();
const mockUseOpenFinanceCardDetails = vi.fn();
const mockUseOpenFinanceCardStatement = vi.fn();

vi.mock('@/stores/company', () => ({
  useCompanyStore: () => ({
    activeCompany: { id: 'company-1' },
  }),
}));

vi.mock('./useOpenFinanceCreditCards', () => ({
  useOpenFinanceCreditCards: () => mockUseOpenFinanceCreditCards(),
}));

vi.mock('./useOpenFinanceCardDetails', () => ({
  useOpenFinanceCardDetails: () => mockUseOpenFinanceCardDetails(),
}));

vi.mock('./useOpenFinanceCardStatement', () => ({
  useOpenFinanceCardStatement: (args: unknown) => mockUseOpenFinanceCardStatement(args),
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

describe('useCreditCardsV2Controller', () => {
  beforeEach(() => {
    mockUseOpenFinanceCreditCards.mockReset();
    mockUseOpenFinanceCardDetails.mockReset();
    mockUseOpenFinanceCardStatement.mockReset();

    mockUseOpenFinanceCreditCards.mockReturnValue({
      cards: [card],
      isLoading: false,
      error: null,
    });
    mockUseOpenFinanceCardDetails.mockReturnValue({
      bills,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseOpenFinanceCardStatement.mockReturnValue({
      transactions: rawTransactions,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('selects the first card and keeps free-period fetch by default', async () => {
    const { result } = renderHook(() => useCreditCardsV2Controller(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.selectedCardId).toBe('mongo-1');
    });
    expect(result.current.selectedBillId).toBeNull();
    expect(result.current.transactions).toHaveLength(2);
  });

  it('filters transactions and uses bill due-date window when a bill is selected', async () => {
    const { result } = renderHook(() => useCreditCardsV2Controller(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.selectedCardId).toBe('mongo-1');
    });

    act(() => {
      result.current.handleSelectBill('bill-old');
    });

    await waitFor(() => {
      expect(result.current.selectedBillId).toBe('bill-old');
    });

    expect(result.current.transactions.map((tx) => tx.id)).toEqual(['tx-1']);
    expect(result.current.fetchPeriod).toEqual({
      startDate: '2025-08-12',
      endDate: '2025-11-17',
    });
    expect(mockUseOpenFinanceCardStatement).toHaveBeenCalledWith(
      expect.objectContaining({
        period: {
          startDate: '2025-08-12',
          endDate: '2025-11-17',
        },
      }),
    );
  });
});
