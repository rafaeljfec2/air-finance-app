/** Presentation-only softener so the status answer feels spoken, not system-like. */

const MULTI_SPACE = /\s{2,}/g;

export function humanizeStatusAnswer(status: string): string {
  const trimmed = status.trim();
  if (trimmed.length === 0) {
    return 'Hoje ainda estamos montando a leitura do seu mês.';
  }

  let soft = trimmed
    .replace(/\bO ciclo está em risco\.?/gi, 'Hoje o mês pede um pouco mais de atenção.')
    .replace(
      /\bCom os dados atuais, o ciclo parece sob controle\.?/gi,
      'Com o que vemos hoje, o mês parece mais estável.',
    )
    .replace(/\bo ciclo parece sob controle\.?/gi, 'o mês parece mais estável.')
    .replace(
      /\bAinda não há dados suficientes\.?/gi,
      'Ainda estamos juntando o essencial para te orientar.',
    )
    .replace(/\bVou conseguir fechar este mês\?/gi, '')
    .replace(/\bo ciclo\b/gi, 'o mês')
    .replace(MULTI_SPACE, ' ')
    .trim();

  if (soft.length === 0) {
    return trimmed;
  }

  if (!/[.!?]$/.test(soft)) {
    soft = `${soft}.`;
  }

  // Capitalize if we left a lowercase fragment after replace
  return soft.charAt(0).toUpperCase() + soft.slice(1);
}
