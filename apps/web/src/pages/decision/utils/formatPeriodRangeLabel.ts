const MONTH_LABELS_PT: readonly string[] = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** e.g. `01 a 31 de julho de 2026` for the full calendar month. */
export function formatPeriodRangeLabel(year: number, month1To12: number): string {
  if (month1To12 < 1 || month1To12 > 12) {
    throw new RangeError('month out of range');
  }
  const lastDay = new Date(year, month1To12, 0).getDate();
  const monthLabel = MONTH_LABELS_PT[month1To12 - 1];
  return `01 a ${String(lastDay).padStart(2, '0')} de ${monthLabel} de ${year}`;
}
