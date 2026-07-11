export interface OpeniIsoDateTimeRange {
  readonly startDate: string;
  readonly endDate: string;
}

function toDateOnly(value: string): string {
  const datePart = value.split('T')[0];
  if (!datePart || !/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return datePart;
}

/**
 * Openi credit-card transactions expect full ISO-8601 datetimes on `from`/`to`.
 * Date-only strings (YYYY-MM-DD) are rejected with "Invalid ISO datetime".
 */
export function toOpeniIsoDateTimeRange(startDate: string, endDate: string): OpeniIsoDateTimeRange {
  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);
  return {
    startDate: `${start}T00:00:00.000Z`,
    endDate: `${end}T23:59:59.999Z`,
  };
}
