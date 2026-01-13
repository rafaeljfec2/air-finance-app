import { Moon, Sun } from 'lucide-react';

interface HeaderThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function HeaderThemeToggle({
  isDarkMode,
  onToggle,
}: Readonly<HeaderThemeToggleProps>) {
  return (
    <button
      onClick={onToggle}
      className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
      aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
