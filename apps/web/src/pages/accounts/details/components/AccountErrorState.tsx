interface AccountErrorStateProps {
  readonly error: Error;
}

export function AccountErrorState({ error }: Readonly<AccountErrorStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
        Erro ao carregar extrato
      </h3>
      <p className="text-sm text-text/70 dark:text-text-dark/70">
        {error.message ?? 'Não foi possível carregar os dados do extrato. Tente novamente.'}
      </p>
    </div>
  );
}
