import { Plus, Terminal } from 'lucide-react';

interface EmptyStateProps {
  readonly onCreate: () => void;
}

export function EmptyState({ onCreate }: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-5">
        <Terminal className="h-8 w-8 text-primary-500 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-bold text-text dark:text-text-dark mb-1.5">
        Nenhum token criado
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
        Crie tokens para integrar com APIs externas, automações e pipelines CI/CD de forma segura.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors"
      >
        <Plus className="h-4 w-4" />
        Criar primeiro token
      </button>

      <div className="mt-8 w-full max-w-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono leading-relaxed">
          curl -H &quot;Authorization: Bearer afk_...&quot; \<br />
          &nbsp;&nbsp;https://api.seudominio.com/endpoint
        </p>
      </div>
    </div>
  );
}
