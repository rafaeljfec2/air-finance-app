import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a date string to Brazilian format (dd/MM/yyyy)
 * Preserves the date components without timezone conversion
 * @param dateString - ISO date string or date string
 * @returns Formatted date string in dd/MM/yyyy format
 */
export function formatDate(dateString: string): string {
  try {
    // Extract date components directly from ISO string (YYYY-MM-DD) to avoid timezone conversion
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(dateString);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      // Create date using local timezone with the extracted components
      // This preserves the date as intended, without UTC conversion
      const date = new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        Number.parseInt(day, 10),
      );
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    }

    // Fallback to standard parsing if not ISO format
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

/**
 * Converts an ISO date string to YYYY-MM-DD format for HTML date input
 * Preserves the date components without timezone conversion
 * @param dateString - ISO date string
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(dateString: string): string {
  try {
    // Extract date components directly from ISO string (YYYY-MM-DD) to avoid timezone conversion
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(dateString);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      return `${year}-${month}-${day}`;
    }

    // Fallback: try to parse and format
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}
