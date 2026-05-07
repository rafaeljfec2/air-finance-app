import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { CompletePlanVariableSpending } from '@/services/completePlanService';

import { CompletePlanVariableSpendingCard } from './CompletePlanVariableSpendingCard';

const base: CompletePlanVariableSpending = {
  bucketHealth: 'attention',
  totalVariable: 450.5,
  previousTotalVariable: 400,
  percentOfIncome: 0.09,
  monthOverMonthChangePct: 12.6,
  topCategories: [{ name: 'Food', amount: 300, share: 0.67 }],
  peakDaysOfMonth: [2, 18],
};

describe('CompletePlanVariableSpendingCard', () => {
  it('renders totals, income share, MoM label and top category', () => {
    render(<CompletePlanVariableSpendingCard variableSpending={base} />);

    expect(screen.getByText('Gastos variáveis')).toBeInTheDocument();
    expect(screen.getByText('Pediu atenção')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText(/\+12\.6%/)).toBeInTheDocument();
    expect(screen.getByText('Dia 2')).toBeInTheDocument();
    expect(screen.getByText('Dia 18')).toBeInTheDocument();
  });

  it('shows a fallback when MoM is not comparable', () => {
    const payload: CompletePlanVariableSpending = {
      ...base,
      monthOverMonthChangePct: null,
    };
    render(<CompletePlanVariableSpendingCard variableSpending={payload} />);

    expect(screen.getByText('Sem comparação com o mês anterior.')).toBeInTheDocument();
  });

  it('shows an empty-state message when there are no variable categories', () => {
    const payload: CompletePlanVariableSpending = {
      ...base,
      topCategories: [],
    };
    render(<CompletePlanVariableSpendingCard variableSpending={payload} />);

    expect(
      screen.getByText('Não há gasto variável registrado neste mês com esse critério.'),
    ).toBeInTheDocument();
  });
});
