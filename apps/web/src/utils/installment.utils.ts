export interface InstallmentInfo {
  readonly current: number;
  readonly total: number;
}

export function extractInstallment(description: string): InstallmentInfo | null {
  const regexParcela = /parcela\s+(\d+)\/(\d+)/i;
  const regexFraction = /(?:^|\s|-)(\d+)\/(\d+)(?:\s|$)/;

  let match = regexParcela.exec(description);
  if (!match) {
    match = regexFraction.exec(description);
  }

  if (!match) return null;

  const current = Number.parseInt(match[1] ?? '0', 10);
  const total = Number.parseInt(match[2] ?? '0', 10);

  if (current <= 0 || total <= 0 || current > total) return null;

  return { current, total };
}

export function isFinishingInstallment(description: string): boolean {
  const installment = extractInstallment(description);
  return installment !== null && installment.current === installment.total;
}
