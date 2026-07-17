import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { parseLocalDate } from '@/utils/date';

/** Formats a `YYYY-MM-DD` date as the mock's compact style, e.g. `05 AGO`. */
export function formatShortDayMonth(isoDate: string): string {
  const formatted = format(parseLocalDate(isoDate), 'dd MMM', { locale: ptBR });
  return formatted.replaceAll('.', '').toUpperCase();
}
