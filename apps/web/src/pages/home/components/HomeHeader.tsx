import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import { Bell, Eye, EyeOff } from 'lucide-react';

interface HomeHeaderProps {
  balance: number;
  isPrivacyModeEnabled: boolean;
  onTogglePrivacyMode: () => void;
}

export function HomeHeader({
  balance,
  isPrivacyModeEnabled,
  onTogglePrivacyMode,
}: Readonly<HomeHeaderProps>) {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          Olá, {user?.name?.split(' ')[0]}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(balance)}
          </h1>
          <button
            onClick={onTogglePrivacyMode}
            className="text-gray-400 hover:text-primary-500"
            aria-label={isPrivacyModeEnabled ? 'Mostrar saldo' : 'Ocultar saldo'}
          >
            {isPrivacyModeEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>
      <button
        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
        aria-label="Notificações"
      >
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
      </button>
    </div>
  );
}
