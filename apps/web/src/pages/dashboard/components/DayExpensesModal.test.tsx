import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DayExpensesModal } from './DayExpensesModal';

const mockUseDayExpenses = vi.fn();
const mockUseAccounts = vi.fn();
const mockUseCategories = vi.fn();

vi.mock('../hooks/useDayExpenses', () => ({
  useDayExpenses: (...args: unknown[]) => mockUseDayExpenses(...args),
}));

vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: () => mockUseAccounts(),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: (...args: unknown[]) => mockUseCategories(...args),
}));

const accounts = [
  { id: 'acc-1', name: 'Banco do Brasil', type: 'checking', color: '#0033AA', icon: 'Landmark' },
  { id: 'acc-2', name: 'Nubank', type: 'credit_card', color: '#8A05BE', icon: 'CreditCard' },
];

const categories = [
  { id: 'cat-1', name: 'Compras', type: 'expense', color: '#8A05BE', icon: 'ShoppingCart' },
];

const expenses = [
  {
    id: 'a',
    description: 'Mercado',
    launchType: 'expense',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    value: -100,
  },
  {
    id: 'b',
    description: 'iFood',
    launchType: 'expense',
    accountId: 'acc-2',
    categoryId: 'cat-1',
    value: -50,
  },
];

describe('DayExpensesModal', () => {
  beforeEach(() => {
    mockUseDayExpenses.mockReset();
    mockUseAccounts.mockReset();
    mockUseCategories.mockReset();
    mockUseDayExpenses.mockReturnValue({ data: expenses, isLoading: false, isError: false });
    mockUseAccounts.mockReturnValue({ accounts });
    mockUseCategories.mockReturnValue({ categories });
  });

  it('renders nothing when no day is selected', () => {
    const { container } = render(<DayExpensesModal companyId="c1" date={null} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders in a portal outside the parent tree so it overlays the whole app', () => {
    const { container } = render(
      <DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.getByRole('heading', { name: /Despesas do dia/i })).toBeInTheDocument();
  });

  it('renders the day title, stats and account groups with subtotals', () => {
    render(<DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /Despesas do dia 18 de Julho de 2026/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    expect(screen.getByText(/2 despesas/i)).toBeInTheDocument();
    expect(screen.getByText(/2 contas\/cartões/i)).toBeInTheDocument();

    expect(screen.getByText('Banco do Brasil')).toBeInTheDocument();
    expect(screen.getByText('Nubank')).toBeInTheDocument();
    expect(screen.getByText('Mercado')).toBeInTheDocument();
    expect(screen.getByText('iFood')).toBeInTheDocument();
  });

  it('shows payment method derived from the account type on each group', () => {
    render(<DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />);

    expect(screen.getByText(/Conta · Débito|Conta.*Débito/)).toBeInTheDocument();
    expect(screen.getByText(/Cartão.*Crédito/)).toBeInTheDocument();
  });

  it('renders an enabled export button when there are expenses', () => {
    render(<DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Exportar/i })).toBeEnabled();
  });

  it('disables the export button when the day has no expenses', () => {
    mockUseDayExpenses.mockReturnValue({ data: [], isLoading: false, isError: false });

    render(<DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Exportar/i })).toBeDisabled();
  });

  it('shows the empty state when the day has no expenses', () => {
    mockUseDayExpenses.mockReturnValue({ data: [], isLoading: false, isError: false });

    render(<DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />);

    expect(screen.getByText(/Nenhuma despesa registrada neste dia/i)).toBeInTheDocument();
  });

  it('shows a loading state while fetching', () => {
    mockUseDayExpenses.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    render(<DayExpensesModal companyId="c1" date="2026-07-18" onClose={vi.fn()} />);

    expect(screen.getByTestId('day-expenses-loading')).toBeInTheDocument();
  });

  it('filters expenses to the selected account when accountId is provided', () => {
    render(
      <DayExpensesModal companyId="c1" date="2026-07-18" accountId="acc-2" onClose={vi.fn()} />,
    );

    expect(screen.getByText('iFood')).toBeInTheDocument();
    expect(screen.queryByText('Mercado')).not.toBeInTheDocument();
    expect(screen.getByText('Nubank')).toBeInTheDocument();
    expect(screen.queryByText('Banco do Brasil')).not.toBeInTheDocument();
    expect(screen.getAllByText('R$ 50,00').length).toBeGreaterThan(0);
    expect(screen.getByText(/1 despesa/i)).toBeInTheDocument();
  });

  it('uses card-scoped copy when accountId is provided', () => {
    render(
      <DayExpensesModal companyId="c1" date="2026-07-18" accountId="acc-2" onClose={vi.fn()} />,
    );

    expect(screen.getByText('Despesas do cartão selecionado.')).toBeInTheDocument();
    expect(
      screen.getByText(/Os valores consideram as despesas do cartão selecionado neste dia/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/todas as despesas registradas em todos os caixas e cartões/i),
    ).not.toBeInTheDocument();
  });
});
