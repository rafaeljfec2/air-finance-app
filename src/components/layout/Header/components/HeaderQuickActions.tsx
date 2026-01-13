import { quickActions } from '../constants/quickActions';

interface HeaderQuickActionsProps {
  onNavigate: (path: string) => void;
}

export function HeaderQuickActions({ onNavigate }: Readonly<HeaderQuickActionsProps>) {
  return (
    <div className="hidden md:flex items-center border-l dark:border-gray-700 pl-4 space-x-1">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.href}
            onClick={() => onNavigate(action.href)}
            className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center"
            title={action.title}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
