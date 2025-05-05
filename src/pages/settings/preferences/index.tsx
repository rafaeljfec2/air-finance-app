import { ViewDefault } from '@/layouts/ViewDefault';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export function PreferencesPage() {
  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 pt-0 pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-4 flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-primary-500" /> Preferências
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Personalize suas configurações e preferências do sistema.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Conteúdo específico de Preferências será adicionado aqui */}
        </div>
      </div>
    </ViewDefault>
  );
}
