import { parseLocalDate } from '@/utils/date';

export function convertValueToDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    const datePart = value.split('T')[0].split(' ')[0].trim();

    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(datePart);
    if (isoDateMatch) {
      return parseLocalDate(datePart);
    }

    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/;
    const ddmmyyyyMatch = ddmmyyyyRegex.exec(datePart);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        Number.parseInt(day, 10),
        0,
        0,
        0,
        0,
      );
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
    }

    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
  }

  return null;
}
