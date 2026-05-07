export interface DecisionPeriodCoverageBannerProps {
  readonly periodCoverage: {
    readonly has_income: boolean;
    readonly has_expense: boolean;
  };
}

export function DecisionPeriodCoverageBanner({
  periodCoverage,
}: DecisionPeriodCoverageBannerProps) {
  if (periodCoverage.has_income && !periodCoverage.has_expense) {
    return (
      <div
        role="status"
        className="rounded-md border border-amber-500/50 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/35 dark:text-amber-50"
      >
        Neste mês há <strong>receita registrada</strong>, mas <strong>quase nenhuma despesa</strong>{' '}
        no fluxo. Complete ou importe as saídas do período para a leitura financeira ficar
        confiável.
      </div>
    );
  }

  if (!periodCoverage.has_income && periodCoverage.has_expense) {
    return (
      <div
        role="status"
        className="rounded-md border border-amber-500/50 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/35 dark:text-amber-50"
      >
        Há <strong>despesas registradas</strong>, mas <strong>sem receita</strong> neste mês no
        fluxo. Registre a entrada principal do período para os percentuais fazerem sentido.
      </div>
    );
  }

  if (!periodCoverage.has_income && !periodCoverage.has_expense) {
    return (
      <div
        role="status"
        className="rounded-md border border-amber-500/50 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/35 dark:text-amber-50"
      >
        Não encontramos <strong>receitas</strong> nem <strong>despesas</strong> neste mês no fluxo.
        Importe ou registre movimentações do período para liberar uma leitura financeira confiável.
      </div>
    );
  }

  return null;
}
