export interface ParsedInstallment {
  readonly current: number;
  readonly total: number;
  readonly baseDescription: string;
}

const PARCELA_REGEX = /parcela\s+(\d+)\/(\d+)/i;
const SIMPLE_REGEX = /(?:^|\s|-)(\d+)\/(\d+)(?:\s|$)/;

/**
 * Detects installment markers in a credit-card transaction description.
 * Patterns: "Parcela X/Y" or trailing/embedded "X/Y".
 */
export function parseInstallmentFromDescription(description: string): ParsedInstallment | null {
  if (!description) {
    return null;
  }

  let match = PARCELA_REGEX.exec(description);
  let pattern: 'parcela' | 'simple' = 'parcela';

  if (!match) {
    match = SIMPLE_REGEX.exec(description);
    pattern = 'simple';
  }

  if (!match) {
    return null;
  }

  const current = Number.parseInt(match[1] ?? '0', 10);
  const total = Number.parseInt(match[2] ?? '0', 10);

  if (current <= 0 || total <= 0 || current > total || total > 999) {
    return null;
  }

  let baseDescription =
    pattern === 'parcela'
      ? description.replaceAll(/parcela\s+\d+\/\d+/gi, '').trim()
      : description.replaceAll(/(?:\s|-)?\d+\/\d+(?:\s|$)/g, '').trim();

  baseDescription = baseDescription
    .replaceAll(/\s+/g, ' ')
    .replaceAll(/[\s-]+$/g, '')
    .trim();

  return {
    current,
    total,
    baseDescription: baseDescription || description,
  };
}

export function normalizeInstallmentBase(description: string): string {
  return description
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim();
}
