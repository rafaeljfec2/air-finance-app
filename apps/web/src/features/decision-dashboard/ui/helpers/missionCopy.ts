/** Presentation-only helpers for shorter, dynamic mission copy. */

/**
 * Support line under the mission title.
 * Never returns mid-sentence truncation with ellipsis.
 */
export function toMissionSupportLine(text: string, maxChars = 110): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return '';
  }

  const firstSentenceMatch = trimmed.match(/^(.+?[.!?])(?:\s|$)/);
  if (firstSentenceMatch?.[1]) {
    const sentence = firstSentenceMatch[1];
    return sentence.length <= maxChars ? sentence : '';
  }

  // Incomplete clause from domain — hide rather than cut with "…"
  if (trimmed.length > maxChars) {
    return '';
  }

  return trimmed;
}

/**
 * CTA that invites action without repeating the mission title.
 */
export function buildCompanionCtaLabel(actionLabel: string): string {
  const normalized = actionLabel.trim().toLowerCase();

  if (normalized.length === 0) {
    return 'Começar por aqui';
  }
  if (normalized.includes('registrar') || normalized.includes('register')) {
    return 'Começar o registro';
  }
  if (normalized.includes('priorize') || normalized.includes('prioriz')) {
    return 'Quero priorizar isso';
  }
  if (normalized.includes('proteger') || normalized.includes('protect')) {
    return 'Quero proteger meu mês';
  }
  if (normalized.includes('folga') || normalized.includes('mexer')) {
    return 'Quero melhorar isso';
  }
  if (normalized.includes('revis') || normalized.includes('review')) {
    return 'Começar agora';
  }

  return 'Quero melhorar isso';
}

/** @deprecated Prefer toMissionSupportLine */
export function toDynamicLine(text: string, maxChars = 88): string {
  return toMissionSupportLine(text, maxChars);
}
