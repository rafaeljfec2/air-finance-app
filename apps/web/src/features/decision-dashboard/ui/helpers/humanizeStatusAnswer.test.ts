import { describe, expect, it } from 'vitest';

import { humanizeStatusAnswer } from './humanizeStatusAnswer';

describe('humanizeStatusAnswer', () => {
  it('softens system-like risk language', () => {
    expect(humanizeStatusAnswer('O ciclo está em risco.')).toBe(
      'Hoje o mês pede um pouco mais de atenção.',
    );
  });

  it('softens under-control cycle wording', () => {
    expect(humanizeStatusAnswer('Com os dados atuais, o ciclo parece sob controle.')).toBe(
      'Com o que vemos hoje, o mês parece mais estável.',
    );
  });

  it('keeps calm human status mostly intact', () => {
    expect(
      humanizeStatusAnswer('Você está no caminho para fechar este mês com tranquilidade.'),
    ).toBe('Você está no caminho para fechar este mês com tranquilidade.');
  });
});
