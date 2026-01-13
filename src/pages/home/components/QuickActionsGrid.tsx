import { QuickActionCard } from './QuickActionCard';
import type { QuickAction } from '../constants/quickActions';

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export function QuickActionsGrid({ actions }: Readonly<QuickActionsGridProps>) {
  return (
    <div className="px-6 py-6 md:px-0 md:col-span-1 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Acesso Rápido
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => (
          <QuickActionCard
            key={action.label}
            {...action}
            className={
              index === 0 || action.label === 'Fluxo de Caixa'
                ? 'col-span-2 aspect-[2/1] flex-row gap-3'
                : 'aspect-square col-span-1'
            }
          />
        ))}
      </div>
    </div>
  );
}
