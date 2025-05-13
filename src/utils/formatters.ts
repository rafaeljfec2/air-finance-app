import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function parseCurrency(value: string): number {
  if (!value) return 0;

  // Remove todos os caracteres não numéricos exceto vírgula e ponto
  const cleanValue = value.replace(/[^\d,.-]/g, '');

  // Se não houver números, retorna 0
  if (!cleanValue.match(/\d/)) return 0;

  // Se houver mais de uma vírgula ou ponto, mantém apenas o último
  const parts = cleanValue.split(/[.,]/);
  if (parts.length > 2) {
    const lastPart = parts.pop();
    const firstPart = parts.join('');
    return parseFloat(`${firstPart}.${lastPart}`);
  }

  // Substitui vírgula por ponto se necessário
  const normalizedValue = cleanValue.replace(',', '.');

  return parseFloat(normalizedValue);
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
