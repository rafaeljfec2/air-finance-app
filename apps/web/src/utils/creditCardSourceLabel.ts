import type { CreditCardSourceState } from '@/types/budget';

export type { CreditCardSourceMode, CreditCardSourceState } from '@/types/budget';

function formatDateLabel(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function buildCreditCardSourceFreshnessLabel(
  sourceState: CreditCardSourceState | null | undefined,
): string | null {
  if (!sourceState) {
    return null;
  }

  const ofxDate = formatDateLabel(sourceState.ofxReconciledUntil);
  const openFinanceDate = formatDateLabel(sourceState.lastOpenFinanceSyncAt);

  switch (sourceState.mode) {
    case 'OFX':
      return ofxDate ? `Base do extrato importado em ${ofxDate}` : 'Base do extrato importado';
    case 'OPEN_FINANCE':
      return openFinanceDate
        ? `Atualizado pelo banco em ${openFinanceDate} · parcelas futuras podem estar incompletas`
        : 'Atualizado pelo banco · parcelas futuras podem estar incompletas';
    case 'COMBINED':
      return ofxDate
        ? `Extrato importado em ${ofxDate} + gastos recentes do banco`
        : 'Extrato importado + gastos recentes do banco';
    case 'MANUAL':
    default:
      return null;
  }
}
