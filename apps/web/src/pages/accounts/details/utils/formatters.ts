export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCurrencyAbsolute = (value: number): string => {
  return formatCurrency(Math.abs(value));
};

const INVALID_DATE_FALLBACK = new Date(0);

function safeParseLocalDate(dateStr: string | null | undefined): Date {
  const raw = dateStr?.trim();
  if (!raw) {
    console.warn('[formatters] Invalid date: empty or null', { dateStr });
    return INVALID_DATE_FALLBACK;
  }
  const part = raw.split('T')[0].split('-').map(Number);
  if (part.length < 3 || part.some(Number.isNaN)) {
    console.warn('[formatters] Invalid date format', { dateStr });
    return INVALID_DATE_FALLBACK;
  }
  const [year, month, day] = part;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    console.warn('[formatters] Invalid date value', { dateStr });
    return INVALID_DATE_FALLBACK;
  }
  return date;
}

export const formatMonthYear = (monthStr: string | null | undefined): string => {
  const raw = monthStr?.trim();
  if (!raw) return '—';
  const parts = raw.split('-').map(Number);
  if (parts.length < 2 || parts.some(Number.isNaN)) {
    console.warn('[formatters] Invalid month string', { monthStr });
    return '—';
  }
  const [year, monthNum] = parts;
  const date = new Date(year, monthNum - 1, 1);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

export const parseLocalDate = (dateStr: string): Date => {
  return safeParseLocalDate(dateStr);
};

export const formatDateShort = (dateStr: string | null | undefined): string => {
  const date = safeParseLocalDate(dateStr);
  if (date.getTime() === INVALID_DATE_FALLBACK.getTime()) return '—';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export const formatDateHeader = (dateStr: string | null | undefined): string => {
  const date = safeParseLocalDate(dateStr);
  if (date.getTime() === INVALID_DATE_FALLBACK.getTime()) return '—';
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
};

export const formatMonthTitle = (monthStr: string | null | undefined): string => {
  const raw = monthStr?.trim();
  if (!raw) return '—';
  const parts = raw.split('-').map(Number);
  if (parts.length < 2 || parts.some(Number.isNaN)) return '—';
  const [year, monthNum] = parts;
  const date = new Date(year, monthNum - 1, 1);
  if (Number.isNaN(date.getTime())) return '—';
  const formatted = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return formatted.replace(' de ', ' De ');
};

export const formatHiddenCurrency = (): string => 'R$ ••••••';
