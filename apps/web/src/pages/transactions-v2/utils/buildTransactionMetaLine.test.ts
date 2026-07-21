import { describe, expect, it } from 'vitest';

import { buildTransactionMetaLine } from './buildTransactionMetaLine';
import { buildTransaction } from './testTransactionFactory';

describe('buildTransactionMetaLine', () => {
  it('shows category and account labels', () => {
    const transaction = buildTransaction({
      categoryId: 'Aluguel recebido',
      accountId: 'ultraviolet-black MASTERCARD',
    });

    expect(buildTransactionMetaLine(transaction)).toBe(
      'Aluguel recebido · ultraviolet-black MASTERCARD',
    );
  });

  it('falls back when category or account is missing', () => {
    const transaction = buildTransaction({
      categoryId: '',
      accountId: '',
    });

    expect(buildTransactionMetaLine(transaction)).toBe('Sem categoria · Sem conta');
  });
});
