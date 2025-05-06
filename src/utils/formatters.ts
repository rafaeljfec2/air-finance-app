import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function parseCurrency(value: string): number {
  return parseFloat(
    value
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.')
      .replace(/\.(?=.*\.)/g, ''),
  );
}

export function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/[^\d]/g, '');
  if (!numericValue) return '';

  const floatValue = parseFloat(numericValue) / 100;
  return formatCurrency(floatValue);
}

export function formatPercentual(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatMonthYear(date: Date | string): string {
  const dateObj = date instanceof Date ? date : parseISO(date);
  return format(dateObj, "MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateTime(dateStr: string, pattern: string): string {
  const date = parseISO(dateStr);
  return format(date, pattern, { locale: ptBR });
}
