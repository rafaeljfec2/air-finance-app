import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import { Bell, Eye, EyeOff } from 'lucide-react';

interface HomeHeaderProps {
  balance: number;
  accumulatedBalance: number | null;
  isPrivacyModeEnabled: boolean;
  onTogglePrivacyMode: () => void;
}

export function HomeHeader({
  balance,
  accumulatedBalance,
  isPrivacyModeEnabled,
  onTogglePrivacyMode,
}: Readonly<HomeHeaderProps>) {
  const { user } = useAuth();

  const getBalanceColorClass = (): string => {
    if (isPrivacyModeEnabled) {
      return 'text-gray-900 dark:text-white';
    }
    return balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
  };

  const getAccumulatedBalanceColorClass = (): string => {
    if (isPrivacyModeEnabled) {
      return 'text-gray-500 dark:text-gray-400';
    }
    return accumulatedBalance !== null && accumulatedBalance >= 0
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          Olá, {user?.name?.split(' ')[0]}
        </p>
        <div className="flex items-center gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${getBalanceColorClass()}`}>
              {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(balance)}
            </h1>
            {accumulatedBalance !== null && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Saldo Acumulado:{' '}
                <span className={`font-medium ${getAccumulatedBalanceColorClass()}`}>
                  {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(accumulatedBalance)}
                </span>
              </p>
            )}
          </div>
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
