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
      />,
    );
    expect(screen.getByText(/Veredito: atenção/i)).toBeInTheDocument();
    expect(screen.getByText(/voltar a respirar/i)).toBeInTheDocument();
    expect(screen.getByText('Priorizamos o que pesa mais no mês.')).toBeInTheDocument();
  });

  it('omits rationale paragraph when ordering rationale is blank', () => {
    const { container } = render(
      <DecisionVerdictPanel status="healthy" themePhase={null} orderingRationale="  " />,
    );
    expect(screen.getByText(/Veredito: manter/i)).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });
});
