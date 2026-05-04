export function getCurrentYYYYMM(now = new Date()): string {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function buildYYYYMM(year: number, month1To12: number): string {
  if (month1To12 < 1 || month1To12 > 12) {
    throw new RangeError('month out of range');
  }
  return `${year}-${String(month1To12).padStart(2, '0')}`;
}

export function resolveEvaluateAutoReferencePeriod(
  year: number,
  month1To12: number,
  now = new Date(),
): string | undefined {
  const selected = buildYYYYMM(year, month1To12);
  const current = getCurrentYYYYMM(now);
  return selected === current ? undefined : selected;
}
