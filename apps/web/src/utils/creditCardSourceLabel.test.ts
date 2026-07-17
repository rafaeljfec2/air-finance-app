import { describe, expect, it } from 'vitest';

import { buildCreditCardSourceFreshnessLabel } from './creditCardSourceLabel';

describe('buildCreditCardSourceFreshnessLabel', () => {
  it('describes OFX-only freshness', () => {
    expect(
      buildCreditCardSourceFreshnessLabel({
        mode: 'OFX',
        ofxReconciledUntil: '2026-07-17T12:00:00.000Z',
      }),
    ).toBe('Base do extrato importado em 17/07/2026');
  });

  it('describes Open Finance-only limitations', () => {
    expect(
      buildCreditCardSourceFreshnessLabel({
        mode: 'OPEN_FINANCE',
        lastOpenFinanceSyncAt: '2026-07-17T15:30:00.000Z',
      }),
    ).toBe('Atualizado pelo banco em 17/07/2026 · parcelas futuras podem estar incompletas');
  });

  it('describes combined baseline plus realtime', () => {
    expect(
      buildCreditCardSourceFreshnessLabel({
        mode: 'COMBINED',
        ofxReconciledUntil: '2026-07-17T12:00:00.000Z',
        lastOpenFinanceSyncAt: '2026-07-17T18:00:00.000Z',
      }),
    ).toBe('Extrato importado em 17/07/2026 + gastos recentes do banco');
  });

  it('returns null for manual-only cards', () => {
    expect(buildCreditCardSourceFreshnessLabel({ mode: 'MANUAL' })).toBeNull();
  });
});
