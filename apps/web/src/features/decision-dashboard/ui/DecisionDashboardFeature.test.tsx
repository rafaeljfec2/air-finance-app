import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDecisionDashboard } from '../hooks/useDecisionDashboard';

import { DecisionDashboardFeature } from './DecisionDashboardFeature';

vi.mock('../hooks/useDecisionDashboard', () => ({
  useDecisionDashboard: vi.fn(),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: (selector: (state: { user: { name: string } | null }) => unknown) =>
    selector({ user: { name: 'Rafael Silva' } }),
}));

const mockedHook = vi.mocked(useDecisionDashboard);

const baseReady = {
  surfaceState: 'ready' as const,
  isLoading: false,
  isError: false,
  isAwaitingCompany: false,
  showSecondaryExpanded: false,
  expandSecondary: vi.fn(),
  collapseSecondary: vi.fn(),
};

describe('DecisionDashboardFeature', () => {
  it('renders parecer reading order: conclusion, evidence, recommendation, benefit', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'O ciclo está em risco.',
        dataState: 'sufficient',
        action: {
          id: 'a1',
          label: 'Prioritize the critical payment',
          rationale: 'Protect the cycle today',
        },
        priorityCards: [
          { code: 'S2', title: 'Saídas críticas', summary: 'There are upcoming outs' },
        ],
        secondaryCards: [],
        insightMessage: 'Focus on the cycle',
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByLabelText('Decision status')).toBeInTheDocument();
    expect(screen.getByLabelText('Conclusion evidence')).toBeInTheDocument();
    expect(screen.getByLabelText('Action of the day')).toBeInTheDocument();
    expect(screen.getByLabelText('Recommendation benefit')).toBeInTheDocument();
    expect(screen.queryByText(/Metas/i)).not.toBeInTheDocument();
  });

  it('uses parecer language and puts recommendation after evidence', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'Você está no caminho para fechar este mês com tranquilidade.',
        dataState: 'sufficient',
        action: {
          id: 'a1',
          label: 'Priorize o pagamento crítico',
          rationale: 'Protege o ciclo hoje.',
        },
        priorityCards: [
          { code: 'S2', title: 'Saídas críticas', summary: 'Há vencimentos próximos.' },
        ],
        secondaryCards: [],
        insightMessage: 'Isso reduz a pressão do ciclo — FP-1 e engine ordering S2.',
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByText(/Rafael/)).toBeInTheDocument();
    expect(screen.getByText(/Chegamos a essa conclusão porque/i)).toBeInTheDocument();
    expect(screen.getByText(/Se eu estivesse no seu lugar/i)).toBeInTheDocument();
    expect(screen.getByText(/O que muda se você fizer isso/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quero priorizar isso/i })).toBeInTheDocument();
    expect(screen.queryByText(/Em volta disso/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/O que percebemos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/FP-1/i)).not.toBeInTheDocument();

    const evidence = screen.getByLabelText('Conclusion evidence');
    const action = screen.getByLabelText('Action of the day');
    expect(
      evidence.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('does not render benefit-only from empty insight on no_data when rationale exists', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'Ainda não há dados suficientes.',
        dataState: 'no_data',
        action: {
          id: 'capture-survivor',
          label: 'Registrar o mínimo do ciclo',
          rationale: 'Complete essentials.',
        },
        priorityCards: [],
        secondaryCards: [],
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Reason',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.queryByLabelText('Conclusion evidence')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Registrar o mínimo do ciclo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Começar o registro' })).toBeInTheDocument();
    expect(screen.getByLabelText('Recommendation benefit')).toBeInTheDocument();
  });

  it('shows awaiting company idle state instead of error', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      surfaceState: 'awaiting_company',
      isAwaitingCompany: true,
      viewModel: null,
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByLabelText('Awaiting company selection')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
