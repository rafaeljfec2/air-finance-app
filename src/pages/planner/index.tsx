import { ViewDefault } from '@/layouts/ViewDefault';
import { CalendarIcon } from '@heroicons/react/24/outline';

export function PlannerPage() {
  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 pt-0 pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-4 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary-500" /> Meu Planner
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Planeje suas finanças e acompanhe seus objetivos financeiros.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Conteúdo específico do Planner será adicionado aqui */}
        </div>
      </div>
    </ViewDefault>
  );
}
