const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm;
}

/** Human caption for the last successful data fetch, e.g. "Dados atualizados há 2 horas". */
export function formatUpdatedAgo(updatedAt: number, now: number = Date.now()): string | null {
  if (!updatedAt) {
    return null;
  }

  const elapsed = Math.max(0, now - updatedAt);

  if (elapsed < MINUTE) {
    return 'Dados atualizados agora mesmo';
  }
  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE);
    return `Dados atualizados há ${minutes} ${plural(minutes, 'minuto', 'minutos')}`;
  }
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    return `Dados atualizados há ${hours} ${plural(hours, 'hora', 'horas')}`;
  }
  const days = Math.floor(elapsed / DAY);
  return `Dados atualizados há ${days} ${plural(days, 'dia', 'dias')}`;
}
