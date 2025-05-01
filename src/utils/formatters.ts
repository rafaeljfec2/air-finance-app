import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function formatDate(data: string): string {
  return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateTime(data: string): string {
  return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}
