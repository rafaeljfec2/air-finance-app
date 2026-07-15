import { describe, expect, it } from 'vitest';

import { resolveNextJourneyStage } from './nextJourneyStage';

describe('resolveNextJourneyStage', () => {
  it('maps survivor to Enxergar with reason and hidden visibility when not ready', () => {
    const stage = resolveNextJourneyStage('survivor', false);

    expect(stage.id).toBe('see');
    expect(stage.label).toBe('Enxergar');
    expect(stage.reason.trim().length).toBeGreaterThan(0);
    expect(stage.visibility).toBe('hidden');
  });

  it('maps organizer to Gerar Caixa', () => {
    const stage = resolveNextJourneyStage('organizer', false);

    expect(stage.id).toBe('generate_cash');
    expect(stage.label).toBe('Gerar Caixa');
    expect(stage.reason.trim().length).toBeGreaterThan(0);
  });

  it('maps builder to Fazer o Dinheiro Trabalhar', () => {
    const stage = resolveNextJourneyStage('builder', false);

    expect(stage.id).toBe('make_money_work');
    expect(stage.label).toBe('Fazer o Dinheiro Trabalhar');
  });

  it('maps investor to Expandir', () => {
    const stage = resolveNextJourneyStage('investor', false);

    expect(stage.id).toBe('expand');
    expect(stage.label).toBe('Expandir a Capacidade Financeira');
  });

  it('keeps expander next stage hidden without promoting further', () => {
    const stage = resolveNextJourneyStage('expander', true);

    expect(stage.id).toBe('expand');
    expect(stage.visibility).toBe('hidden');
    expect(stage.reason.trim().length).toBeGreaterThan(0);
  });

  it('exposes available visibility only when readyForNext and not expander', () => {
    const stage = resolveNextJourneyStage('survivor', true);

    expect(stage.visibility).toBe('available');
  });
});
