import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DecisionPeriodCoverageBanner } from './DecisionPeriodCoverageBanner';

describe('DecisionPeriodCoverageBanner', () => {
  it('shows income-without-expense hint', () => {
    render(
      <DecisionPeriodCoverageBanner periodCoverage={{ has_income: true, has_expense: false }} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/receita registrada/i);
    expect(screen.getByRole('status')).toHaveTextContent(/despesa/i);
  });

  it('shows expense-without-income hint', () => {
    render(
      <DecisionPeriodCoverageBanner periodCoverage={{ has_income: false, has_expense: true }} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/sem receita/i);
  });

  it('renders nothing when both sides have activity', () => {
    const { container } = render(
      <DecisionPeriodCoverageBanner periodCoverage={{ has_income: true, has_expense: true }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows guidance when neither income nor expense is flagged', () => {
    render(
      <DecisionPeriodCoverageBanner periodCoverage={{ has_income: false, has_expense: false }} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/não encontramos/i);
    expect(screen.getByRole('status')).toHaveTextContent(/receitas/i);
    expect(screen.getByRole('status')).toHaveTextContent(/despesas/i);
  });
});
