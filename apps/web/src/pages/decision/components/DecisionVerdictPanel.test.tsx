import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DecisionVerdictPanel } from './DecisionVerdictPanel';

describe('DecisionVerdictPanel', () => {
  it('shows verdict for attention and ordering rationale', () => {
    render(
      <DecisionVerdictPanel
        status="attention"
        themePhase="yellow"
        orderingRationale="Priorizamos o que pesa mais no mês."
        primaryIssue="high_fixed_cost"
        issueDrivers={[]}
      />,
    );
    expect(screen.getByText(/Leitura: há o que ajustar/i)).toBeInTheDocument();
    expect(screen.getByText(/recuperar folga/i)).toBeInTheDocument();
    expect(screen.getByText('Priorizamos o que pesa mais no mês.')).toBeInTheDocument();
  });

  it('omits rationale paragraph when ordering rationale is blank', () => {
    const { container } = render(
      <DecisionVerdictPanel
        status="healthy"
        themePhase={null}
        orderingRationale="  "
        primaryIssue="healthy"
        issueDrivers={[]}
      />,
    );
    expect(screen.getByText(/Leitura: o período sustenta/i)).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });

  it('replaces technical ordering rationale with plain-language summary', () => {
    render(
      <DecisionVerdictPanel
        status="attention"
        themePhase="yellow"
        orderingRationale="Prioridade (FR-1): eixo X. KPIs considerados (ordenados): fixed_vs_variable_split."
        primaryIssue="high_fixed_cost"
        issueDrivers={[]}
      />,
    );
    expect(screen.getByText(/despesas fixas/i)).toBeInTheDocument();
    expect(screen.queryByText(/FR-1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fixed_vs_variable_split/i)).not.toBeInTheDocument();
  });

  it('shows KPI metrics line when issue drivers are present', () => {
    render(
      <DecisionVerdictPanel
        status="attention"
        themePhase="yellow"
        orderingRationale="ok"
        primaryIssue="liquidity_risk"
        issueDrivers={[{ kpi_id: 'checking_runway_days', level: 'alert', value: 12 }]}
      />,
    );
    expect(screen.getByTestId('verdict-metrics-line')).toHaveTextContent(/Reserva de caixa/i);
    expect(screen.getByTestId('verdict-metrics-line')).toHaveTextContent(/12 dias/i);
  });
});
