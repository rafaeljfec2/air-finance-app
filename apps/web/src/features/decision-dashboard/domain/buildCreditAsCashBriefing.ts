import type { DecisionBriefingFacts } from '../mappers/deriveBriefingFacts';

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function shortCardName(name: string): string {
  const cleaned = name
    .replace(/\b(mastercard|visa|elo|amex)\b/gi, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const first = cleaned.split(' ')[0] ?? cleaned;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export interface BriefingEvidenceFact {
  readonly label: string;
  readonly value: string;
}

export interface CreditAsCashBriefingCopy {
  readonly status: string;
  readonly statusLines: readonly string[];
  readonly evidence: readonly BriefingEvidenceFact[];
  readonly preserve: readonly string[];
  readonly avoid: readonly string[];
  readonly decision: string;
  readonly ctaLabel: string;
}

/**
 * Phase-1 Home briefing — plain language only. Layout stays in UI components.
 */
export function buildCreditAsCashBriefing(
  facts: DecisionBriefingFacts | undefined,
): CreditAsCashBriefingCopy {
  const anchor = facts?.anchorReceivable;
  const cash = facts?.operationalCash;
  const projected = facts?.projectedMonthBalance;
  const operating = facts?.operatingCardName ? shortCardName(facts.operatingCardName) : undefined;
  const idle = facts?.idleCardName ? shortCardName(facts.idleCardName) : undefined;

  const bridgeName = anchor ? `${anchor.label} do dia ${anchor.dueDay}` : 'próxima entrada';

  const cashLine =
    cash !== undefined && cash < 500
      ? 'Hoje o dinheiro na conta está curto.'
      : 'Hoje ainda há algum dinheiro na conta.';

  let planLine: string;
  if (projected === undefined) {
    planLine = 'Ainda não dá para cravar se o mês fecha só pelo planejamento.';
  } else if (projected >= 0) {
    planLine = 'No plano, o mês ainda pode fechar no positivo.';
  } else {
    planLine = 'No plano, o mês ainda pode fechar no negativo.';
  }

  const bridgeLine = `Até a ${bridgeName}, não use o cartão.`;
  const statusLines = [cashLine, planLine, bridgeLine] as const;
  const status = statusLines.join(' ');

  const evidence: BriefingEvidenceFact[] = [];
  if (cash !== undefined) {
    evidence.push({
      label: 'Na conta hoje',
      value: formatBrl(cash),
    });
  }
  if (projected !== undefined) {
    evidence.push({
      label: 'No plano do mês',
      value: projected >= 0 ? `+${formatBrl(projected)}` : formatBrl(projected),
    });
  }
  if (anchor) {
    evidence.push({
      label: 'Próxima entrada',
      value: `${anchor.label} · ${formatBrl(anchor.amount)} · dia ${anchor.dueDay}`,
    });
  } else {
    evidence.push({
      label: 'Próxima entrada',
      value: 'Ainda sem data clara',
    });
  }

  const preserve = [
    'O dinheiro que ainda resta na conta até a próxima entrada chegar',
    'Sua folga para pagar o que já está combinado, sem abrir mais dívida',
  ];

  const avoidLines: string[] = [
    'Usar o cartão como se fosse o salário do mês',
    'Fazer compra nova ou assumir compromisso novo antes da entrada cair',
  ];
  if (idle) {
    avoidLines[1] = `Abrir o ${idle} ou qualquer limite novo antes da ${anchor?.label ?? 'próxima entrada'} chegar`;
  }

  let decision: string;
  let ctaLabel: string;

  if (operating && idle && anchor) {
    decision = `Não use o ${operating} nem o ${idle} até a ${anchor.label} de ${anchor.dueDateShort}.`;
    ctaLabel = `Vou segurar os dois cartões até o dia ${anchor.dueDay}`;
  } else if (operating && anchor) {
    decision = `Não use o ${operating} até a ${anchor.label} de ${anchor.dueDateShort}.`;
    ctaLabel = `Vou segurar o cartão até o dia ${anchor.dueDay}`;
  } else {
    decision =
      'Não use o cartão — nem um segundo limite — até o dinheiro da próxima entrada cair na conta.';
    ctaLabel = 'Vou seguir esse passo';
  }

  return {
    status,
    statusLines,
    evidence: evidence.slice(0, 3),
    preserve,
    avoid: avoidLines.slice(0, 2),
    decision,
    ctaLabel,
  };
}
