export interface DailyTipSummary {
  readonly income: number;
  readonly expenses: number;
  readonly balance: number;
}

export const DEFAULT_DAILY_TIP = 'Pequenas decisões diárias constroem grandes resultados mensais.';

export function resolveDailyTip(summary: DailyTipSummary | null | undefined): string {
  if (!summary) {
    return DEFAULT_DAILY_TIP;
  }

  if (summary.expenses > summary.income) {
    return 'Suas saídas estão acima das entradas neste mês — um ajuste pequeno hoje protege o fechamento.';
  }

  if (summary.balance > 0) {
    return 'O mês está no caminho positivo — manter o plano é o que preserva essa folga.';
  }

  return DEFAULT_DAILY_TIP;
}
