import type { DayExpensesSummary } from './buildDayExpensesSummary';

const SEPARATOR = ';';
const HEADER = ['Conta/Cartão', 'Descrição', 'Categoria', 'Forma de pagamento', 'Valor'];

function escapeField(value: string): string {
  if (value.includes(SEPARATOR) || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function formatAmount(amount: number): string {
  return (-amount).toFixed(2).replace('.', ',');
}

export function buildDayExpensesCsv(summary: DayExpensesSummary): string {
  const lines = [HEADER.join(SEPARATOR)];

  for (const group of summary.groups) {
    for (const row of group.rows) {
      lines.push(
        [
          escapeField(group.accountName),
          escapeField(row.description),
          escapeField(row.categoryName),
          escapeField(group.paymentMethodLabel),
          formatAmount(row.amount),
        ].join(SEPARATOR),
      );
    }
  }

  return lines.join('\n');
}
