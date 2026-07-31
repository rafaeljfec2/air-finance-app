import { describe, expect, it } from 'vitest';

import { resolveStatementErrorMessage } from './resolveStatementErrorMessage';

describe('resolveStatementErrorMessage', () => {
  it('returns Error.message when present', () => {
    expect(resolveStatementErrorMessage(new Error('Falha na API'))).toBe('Falha na API');
  });

  it('returns string errors', () => {
    expect(resolveStatementErrorMessage('Timeout')).toBe('Timeout');
  });

  it('reads message from plain objects', () => {
    expect(resolveStatementErrorMessage({ message: 'Conta não encontrada' })).toBe(
      'Conta não encontrada',
    );
  });

  it('falls back when message is [object Object]', () => {
    expect(resolveStatementErrorMessage(new Error('[object Object]'))).toBe(
      'Não foi possível carregar os lançamentos. Tente novamente.',
    );
  });

  it('falls back for empty or unknown values', () => {
    expect(resolveStatementErrorMessage(null)).toBe(
      'Não foi possível carregar os lançamentos. Tente novamente.',
    );
    expect(resolveStatementErrorMessage({})).toBe(
      'Não foi possível carregar os lançamentos. Tente novamente.',
    );
  });
});
