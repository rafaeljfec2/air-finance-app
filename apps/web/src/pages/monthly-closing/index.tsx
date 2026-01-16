import { ViewDefault } from '@/layouts/ViewDefault';
import { Calendar } from 'lucide-react';

export function MonthlyClosing() {
  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 pt-0 pb-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 p-2">
              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark">
              Fechamento Mensal
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
            Acompanhe o fechamento mensal das suas finanças e mantenha o controle do seu orçamento
          </p>
        </div>

        {/* Conteúdo da página */}
        <div className="grid grid-cols-1 gap-6">
          {/* Adicione aqui os componentes específicos de Fechamento Mensal */}
        </div>
      </div>
    </ViewDefault>
  );
}
