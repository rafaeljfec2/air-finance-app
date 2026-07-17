import { describe, expect, it } from 'vitest';

import {
  normalizeInstallmentBase,
  parseInstallmentFromDescription,
} from './parseInstallmentFromDescription';

describe('parseInstallmentFromDescription', () => {
  it('parses simple X/Y at the end of the description', () => {
    expect(parseInstallmentFromDescription('Mapfre Seguros 6/12')).toEqual({
      current: 6,
      total: 12,
      baseDescription: 'Mapfre Seguros',
    });
  });

  it('parses Parcela X/Y pattern', () => {
    expect(parseInstallmentFromDescription('Compra Parcela 2/10 loja')).toEqual({
      current: 2,
      total: 10,
      baseDescription: 'Compra loja',
    });
  });

  it('returns null when there is no installment marker', () => {
    expect(parseInstallmentFromDescription('Supermercados Bh')).toBeNull();
  });

  it('returns null for invalid ratios', () => {
    expect(parseInstallmentFromDescription('Item 0/5')).toBeNull();
    expect(parseInstallmentFromDescription('Item 6/5')).toBeNull();
  });
});

describe('normalizeInstallmentBase', () => {
  it('normalizes accents and case', () => {
    expect(normalizeInstallmentBase('Márcia Café')).toBe('marcia cafe');
  });
});
