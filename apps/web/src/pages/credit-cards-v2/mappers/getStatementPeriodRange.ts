export type StatementPeriodPreset = 30 | 60 | 90;

export interface StatementPeriodRange {
  readonly startDate: string;
  readonly endDate: string;
}

function toDateOnlyIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @param windowOffset 0 = current window ending today; -1 = previous window, etc.
 */
export function getStatementPeriodRange(
  preset: StatementPeriodPreset,
  now: Date = new Date(),
  windowOffset = 0,
): StatementPeriodRange {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  end.setDate(end.getDate() - windowOffset * preset);

  const start = new Date(end);
  start.setDate(start.getDate() - (preset - 1));

  return {
    startDate: toDateOnlyIso(start),
    endDate: toDateOnlyIso(end),
  };
}
