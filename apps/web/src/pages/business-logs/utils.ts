import { BusinessLog } from '@/services/businessLogService';
import { entityTypeLabels, operationLabels } from './constants';

/**
 * Format a date string to Brazilian date-time format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Filter logs by search term
 */
export function filterLogsBySearchTerm(logs: BusinessLog[], searchTerm: string): BusinessLog[] {
  if (!searchTerm) return logs;

  const term = searchTerm.toLowerCase();
  return logs.filter(
    (log) =>
      log.userEmail.toLowerCase().includes(term) ||
      log.entityId.toLowerCase().includes(term) ||
      entityTypeLabels[log.entityType]?.toLowerCase().includes(term) ||
      operationLabels[log.operation]?.toLowerCase().includes(term),
  );
}

