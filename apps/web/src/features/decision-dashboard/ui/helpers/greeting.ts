export type DayPeriod = 'morning' | 'afternoon' | 'evening';

export function resolveDayPeriod(date: Date = new Date()): DayPeriod {
  const hour = date.getHours();
  if (hour < 12) {
    return 'morning';
  }
  if (hour < 18) {
    return 'afternoon';
  }
  return 'evening';
}

export function resolveFirstName(fullName: string | null | undefined): string {
  const trimmed = fullName?.trim() ?? '';
  if (trimmed.length === 0) {
    return '';
  }
  return trimmed.split(/\s+/)[0] ?? '';
}

export function buildReceptionGreeting(
  fullName: string | null | undefined,
  date: Date = new Date(),
): string {
  const firstName = resolveFirstName(fullName);
  const period = resolveDayPeriod(date);
  const salute =
    period === 'morning' ? 'Bom dia' : period === 'afternoon' ? 'Boa tarde' : 'Boa noite';
  if (firstName.length === 0) {
    return `${salute}.`;
  }
  return `${salute}, ${firstName}.`;
}
