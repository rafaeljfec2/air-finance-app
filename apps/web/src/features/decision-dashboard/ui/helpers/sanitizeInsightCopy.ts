/**
 * Presentation-only: never surface technical ranking / engine prose.
 * Prefer a calm human fallback whenever the copy still looks like a report.
 */

const HUMAN_FALLBACK =
  'Porque este gesto é o que mais alivia a pressão do seu dia — e deixa o restante mais claro.';

const TECHNICAL_MARKERS =
  /\b(?:KPI|KPIs|API|score|ranking|engine|ordering|rationale|algorithm|heuristic|archetype|payload|escada|gravidade|fronteira|eixo|indicadores?|ordenação|ordenacao|alertas?|atenção|atencao|zona|fixed_vs_|variable_split|split|produto)\b|[a-z]+_[a-z0-9_]+|\(\s*\)/i;

const INTERNAL_CODE_PATTERN =
  /\b(?:FP|FR|FES|RF|SPEC|IS)-\d+\b|\b[A-Z](?:-\w+)?-\d+\b|\b[SCBE]\d+\b/gi;
const ENGINEERING_TOKEN_PATTERN =
  /\b(?:engine|ordering|rationale|algorithm|heuristic|archetype|payload|score|ranking|KPI|KPIs|API)\b/gi;
const MULTI_SPACE = /\s{2,}/g;

function looksTechnical(message: string): boolean {
  if (TECHNICAL_MARKERS.test(message)) {
    return true;
  }
  const underscoreIds = message.match(/[a-z]+_[a-z0-9_]+/gi) ?? [];
  if (underscoreIds.length > 0) {
    return true;
  }
  // Dense punctuation / report structure after cleanup attempts
  if ((message.match(/;/g) ?? []).length >= 2) {
    return true;
  }
  if ((message.match(/:/g) ?? []).length >= 2) {
    return true;
  }
  return false;
}

function stripNoise(message: string): string {
  return message
    .replace(INTERNAL_CODE_PATTERN, ' ')
    .replace(ENGINEERING_TOKEN_PATTERN, ' ')
    .replace(/\(\s*\)/g, ' ')
    .replace(MULTI_SPACE, ' ')
    .trim();
}

function softenTone(text: string): string {
  return text
    .replace(/\bHá risco de apertar o ciclo\b/gi, 'Hoje o mês pede um cuidado a mais')
    .replace(
      /\bo gesto de hoje é o que mais protege o fechamento\b/gi,
      'um único cuidado já ajuda bastante',
    )
    .replace(/\bFocus on the cycle\b/gi, 'Vale manter o olhar no que fecha o mês')
    .replace(/\bProtect the cycle today\b/gi, 'Isso protege o seu fechamento de hoje')
    .replace(/\bevidência de entradas e saídas\b/gi, 'clareza sobre o que entra e o que sai')
    .replace(/\bcompromissos no ciclo\b/gi, 'compromissos neste mês')
    .replace(/\bpressão do ciclo\b/gi, 'pressão do mês')
    .replace(/\bo ciclo\b/gi, 'o mês');
}

export function humanizeInsightCopy(message: string): string {
  const raw = message.trim();
  if (raw.length === 0 || looksTechnical(raw)) {
    return HUMAN_FALLBACK;
  }

  const stripped = stripNoise(raw);
  if (stripped.length < 12 || looksTechnical(stripped)) {
    return HUMAN_FALLBACK;
  }

  let human = softenTone(stripped).replace(MULTI_SPACE, ' ').trim();
  if (human.length < 12 || looksTechnical(human)) {
    return HUMAN_FALLBACK;
  }

  if (!/[.!?]$/.test(human)) {
    human = `${human}.`;
  }

  return human;
}

export function sanitizeInsightCopy(message: string): string {
  return humanizeInsightCopy(message);
}
