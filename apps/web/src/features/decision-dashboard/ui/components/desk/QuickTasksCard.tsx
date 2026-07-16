import { ChevronRight, Flag, Import, Receipt, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickTask {
  readonly label: string;
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

const TASKS: readonly QuickTask[] = [
  {
    label: 'Importar extrato',
    description: 'Atualize seus movimentos',
    href: '/import-ofx',
    icon: Import,
  },
  {
    label: 'Registrar pagamento',
    description: 'Contas e boletos',
    href: '/payments',
    icon: Send,
  },
  {
    label: 'Ver próximos compromissos',
    description: 'Contas e assinaturas',
    href: '/recurring-transactions',
    icon: Receipt,
  },
  {
    label: 'Acompanhar metas',
    description: 'Veja sua evolução',
    href: '/goals',
    icon: Flag,
  },
];

export function QuickTasksCard() {
  return (
    <section
      aria-label="Tarefas rápidas"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-border-dark dark:bg-card-dark"
    >
      <h2 className="text-sm font-semibold text-text dark:text-text-dark">Tarefas rápidas</h2>

      <ul className="mt-3 space-y-2">
        {TASKS.map((task) => {
          const Icon = task.icon;
          return (
            <li key={task.href}>
              <Link
                to={task.href}
                className="flex min-h-[40px] items-center gap-3 rounded-xl border border-border px-3 py-1.5 transition-colors hover:bg-background dark:border-border-dark dark:hover:bg-background-dark"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-text-muted dark:bg-background-dark dark:text-text-muted-dark">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text dark:text-text-dark">
                    {task.label}
                  </span>
                  <span className="block text-xs text-text-muted dark:text-text-muted-dark">
                    {task.description}
                  </span>
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-text-muted dark:text-text-muted-dark"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-border pt-3 dark:border-border-dark">
        <Link
          to="/movements"
          className="inline-flex text-sm font-medium text-emerald-500 hover:text-emerald-400"
        >
          Ver todas as opções →
        </Link>
      </div>
    </section>
  );
}
