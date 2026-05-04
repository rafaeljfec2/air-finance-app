import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getPlaybook } from '../playbooks';

import { DecisionPlaybookCard } from './DecisionPlaybookCard';

describe('DecisionPlaybookCard', () => {
  it('renders title, explanation and active phase badge', () => {
    const playbook = getPlaybook('high_commitment');
    render(<DecisionPlaybookCard playbook={playbook} phase="red" />);

    expect(screen.getByText(playbook.title)).toBeInTheDocument();
    expect(screen.getByText(playbook.explanation)).toBeInTheDocument();
    expect(screen.getAllByText('Vermelho').length).toBeGreaterThanOrEqual(1);
  });

  it('expands the active phase by default and lists all its actions', () => {
    const playbook = getPlaybook('credit_overuse');
    render(<DecisionPlaybookCard playbook={playbook} phase="yellow" />);

    const yellowButton = screen.getByRole('button', { name: /Amarelo · você está aqui/i });
    expect(yellowButton).toHaveAttribute('aria-expanded', 'true');

    const panel = screen.getByRole('region', { name: /Amarelo · você está aqui/i });
    for (const action of playbook.phases.yellow.actions) {
      expect(within(panel).getByText(action)).toBeInTheDocument();
    }
  });

  it('toggles to another phase when its header is clicked', () => {
    const playbook = getPlaybook('low_surplus');
    render(<DecisionPlaybookCard playbook={playbook} phase="red" />);

    const greenButton = screen.getByRole('button', { name: /Verde$/i });
    fireEvent.click(greenButton);

    expect(greenButton).toHaveAttribute('aria-expanded', 'true');
    const greenPanel = screen.getByRole('region', { name: /Verde$/i });
    expect(within(greenPanel).getByText(playbook.phases.green.actions[0])).toBeInTheDocument();
  });

  it('renders rule and expectedImpact blocks', () => {
    const playbook = getPlaybook('debt_pressure');
    render(<DecisionPlaybookCard playbook={playbook} phase="green" />);

    expect(screen.getByText('Regra simples')).toBeInTheDocument();
    expect(screen.getByText(playbook.rule)).toBeInTheDocument();
    expect(screen.getByText('Resultado esperado')).toBeInTheDocument();
    expect(screen.getByText(playbook.expectedImpact)).toBeInTheDocument();
  });

  it('shows data-incomplete placeholder when phase is null', () => {
    const playbook = getPlaybook('data_incomplete');
    render(<DecisionPlaybookCard playbook={playbook} phase={null} />);

    expect(screen.getByText(playbook.title)).toBeInTheDocument();
    expect(
      screen.getByText('Complete os dados para o app montar seu plano em fases.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Vermelho/ })).not.toBeInTheDocument();
  });
});
