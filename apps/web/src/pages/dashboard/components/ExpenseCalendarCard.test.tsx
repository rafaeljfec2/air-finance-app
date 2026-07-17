import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExpenseCalendarCard } from './ExpenseCalendarCard';

const mockUseDashboardBalanceHistory = vi.fn();
const mockGoToPreviousMonth = vi.fn();
const mockGoToNextMonth = vi.fn();

vi.mock('@/hooks/useDashboard', () => ({
  useDashboardBalanceHistory: (...args: unknown[]) => mockUseDashboardBalanceHistory(...args),
}));

vi.mock('../hooks/useExpenseCalendarMonth', () => ({
  useExpenseCalendarMonth: () => ({
    filters: { timeRange: 'month', referenceDate: new Date(2026, 5, 1).toISOString() },
    monthLabel: 'Junho de 2026',
    isCurrentMonth: false,
    goToPreviousMonth: mockGoToPreviousMonth,
    goToNextMonth: mockGoToNextMonth,
  }),
}));

vi.mock('./DayExpensesModal', () => ({
  DayExpensesModal: ({ date }: { date: string | null }) =>
    date ? <div data-testid="day-expenses-modal">{date}</div> : null,
}));

const historyPoint = {
  date: '2026-06-10T12:00:00',
  balance: 100,
  income: 0,
  expenses: 80,
  expenseTransactionCount: 2,
};

describe('ExpenseCalendarCard', () => {
  beforeEach(() => {
    mockUseDashboardBalanceHistory.mockReset();
    mockGoToPreviousMonth.mockReset();
    mockGoToNextMonth.mockReset();
    mockUseDashboardBalanceHistory.mockReturnValue({
      data: [historyPoint],
      isLoading: false,
      isFetching: false,
    });
  });

  it('renders the calendar month label and fetches all-account history', () => {
    render(<ExpenseCalendarCard companyId="company-1" initialReferenceDate="2026-06-01" />);

    expect(screen.getByText('Junho de 2026')).toBeInTheDocument();
    expect(mockUseDashboardBalanceHistory).toHaveBeenCalledWith('company-1', {
      timeRange: 'month',
      referenceDate: expect.any(String),
      accountScope: 'all',
    });
  });

  it('navigates months locally when chevrons are clicked', () => {
    render(<ExpenseCalendarCard companyId="company-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Mês anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próximo mês' }));

    expect(mockGoToPreviousMonth).toHaveBeenCalledTimes(1);
    expect(mockGoToNextMonth).toHaveBeenCalledTimes(1);
  });

  it('exposes total and quantity for days with expenses', () => {
    render(<ExpenseCalendarCard companyId="company-1" />);

    expect(screen.getByRole('button', { name: /2 despesas/i })).toBeInTheDocument();
  });

  it('opens the day expenses modal for the clicked day', () => {
    render(<ExpenseCalendarCard companyId="company-1" />);

    expect(screen.queryByTestId('day-expenses-modal')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /2 despesas/i }));

    const modal = screen.getByTestId('day-expenses-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('2026-06-10');
  });

  it('shows skeleton while cold loading without data', () => {
    mockUseDashboardBalanceHistory.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    });

    render(<ExpenseCalendarCard companyId="company-1" />);

    expect(screen.getByTestId('expense-calendar-skeleton')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /2 despesas/i })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Mapa de despesas do mês' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('keeps grid visible and disables navigation while refetching', () => {
    mockUseDashboardBalanceHistory.mockReturnValue({
      data: [historyPoint],
      isLoading: false,
      isFetching: true,
    });

    render(<ExpenseCalendarCard companyId="company-1" />);

    expect(screen.getByRole('button', { name: /2 despesas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toBeDisabled();
    expect(screen.getByRole('region', { name: 'Mapa de despesas do mês' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('does not show skeleton in the ready state', () => {
    render(<ExpenseCalendarCard companyId="company-1" />);

    expect(screen.queryByTestId('expense-calendar-skeleton')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Mapa de despesas do mês' })).toHaveAttribute(
      'aria-busy',
      'false',
    );
  });
});
