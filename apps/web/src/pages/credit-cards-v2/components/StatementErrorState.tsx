import { Link } from 'react-router-dom';

import { resolveStatementErrorMessage } from '../mappers/resolveStatementErrorMessage';

interface StatementErrorStateProps {
  readonly error: unknown;
  readonly onRetry?: () => void;
}

export function StatementErrorState({ error, onRetry }: Readonly<StatementErrorStateProps>) {
  const message = resolveStatementErrorMessage(error);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <span className="text-2xl text-red-600 dark:text-red-400" aria-hidden>
          !
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text dark:text-text-dark">
        Erro ao carregar cartões
      </h3>
      <p className="mb-4 max-w-sm text-sm text-text/70 dark:text-text-dark/70">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-11 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            Tentar novamente
          </button>
        ) : null}
        <Link
          to="/openfinance"
          className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text dark:border-border-dark dark:text-text-dark"
        >
          Ir para Open Finance
        </Link>
      </div>
    </div>
  );
}
