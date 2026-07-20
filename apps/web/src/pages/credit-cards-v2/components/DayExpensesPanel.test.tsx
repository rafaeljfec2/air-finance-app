import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DayExpensesPanel } from './DayExpensesPanel';

const mockUseDayExpenses = vi.fn();
const mockUseAccounts = vi.fn();
const mockUseCategories = vi.fn();

vi.mock('@/pages/dashboard/hooks/useDayExpenses', () => ({
  useDayExpenses: (...args: unknown[]) => mockUseDayExpenses(...args),
}));

vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: (...args: unknown[]) => mockUseAccounts(...args),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: (...args: unknown[]) => mockUseCategories(...args),
}));

vi.mock('@/utils/categoryIcons', () => ({
  getCategoryIcon: () => () => null,
}));

const CARD_ID = 'card-1';

function makeExpense(id: string, value: number, description: string) {
  return {
    id,
    description,
    value,
    launchType: 'expense' as const,
    accountId: CARD_ID,
    categoryId: 'cat-1',
    paymentDate: '2026-07-18',
  };
}

describe('DayExpensesPanel', () => {
  beforeEach(() => {
    mockUseDayExpenses.mockReset();
    mockUseAccounts.mockReset();
    mockUseCategories.mockReset();

    mockUseAccounts.mockReturnValue({
      accounts: [
        {
          id: CARD_ID,
          name: 'Nubank',
          type: 'credit_card',
          color: '#8A05BE',
          icon: 'CreditCard',
        },
      ],
    });
    mockUseCategories.mockReturnValue({
      categories: [{ id: 'cat-1', name: 'Supermercado', color: '#EF4444', type: 'expense' }],
    });
  });

  it('shows the day total for expenses in the grid footer', () => {
    mockUseDayExpenses.mockReturnValue({
      data: [
        makeExpense('t1', 248.9, 'SUPER NOSSO'),
        makeExpense('t2', 117, 'SUPERMERCADOS BH'),
        makeExpense('t3', 99.94, 'PLT COMERCIO'),
      ],
      isLoading: false,
      isError: false,
    });

    render(
      <DayExpensesPanel
        companyId="c1"
        date="2026-07-18"
        accountId={CARD_ID}
        onOpenDayDetails={vi.fn()}
      />,
    );

    expect(screen.getByText('Total do dia')).toBeInTheDocument();
    expect(screen.getByTestId('day-expenses-panel-total')).toHaveTextContent(/465[,.]84/);
    expect(screen.getByTestId('day-expenses-panel-total')).not.toHaveTextContent(/-/);
    expect(
      screen.getByRole('button', { name: /Ver todas as despesas do dia/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('day-expenses-panel-total').parentElement).toContainElement(
      screen.getByRole('button', { name: /Ver todas as despesas do dia/i }),
    );
  });

  it('hides the day total when there are no expenses', () => {
    mockUseDayExpenses.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(
      <DayExpensesPanel
        companyId="c1"
        date="2026-07-18"
        accountId={CARD_ID}
        onOpenDayDetails={vi.fn()}
      />,
    );

    expect(screen.queryByTestId('day-expenses-panel-total')).not.toBeInTheDocument();
  });
});
