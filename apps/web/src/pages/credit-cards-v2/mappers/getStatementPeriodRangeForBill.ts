import type { StatementPeriodRange } from './getStatementPeriodRange';

const DEFAULT_DAYS_BEFORE = 90;
const DEFAULT_DAYS_AFTER = 7;

function parseDueDate(dueDate: string): Date {
  const datePart = dueDate.split('T')[0] ?? dueDate;
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toDateOnlyIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Builds a transaction fetch window around an Open Finance bill due date.
 * Default: 90 days before due date through 7 days after (covers long billing cycles).
 */
export function getStatementPeriodRangeForBill(
  dueDate: string,
  daysBefore: number = DEFAULT_DAYS_BEFORE,
  daysAfter: number = DEFAULT_DAYS_AFTER,
): StatementPeriodRange {
  const due = parseDueDate(dueDate);

  const start = new Date(due);
  start.setDate(start.getDate() - daysBefore);

  const end = new Date(due);
  end.setDate(end.getDate() + daysAfter);

  return {
    startDate: toDateOnlyIso(start),
    endDate: toDateOnlyIso(end),
  };
}
