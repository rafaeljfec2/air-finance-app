import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Olá, {user?.name?.split(' ')[0]}
        </p>
        <button
          onClick={onTogglePrivacyMode}
          className="text-gray-400 hover:text-primary-500 flex-shrink-0 transition-colors"
          aria-label={isPrivacyModeEnabled ? 'Mostrar saldo' : 'Ocultar saldo'}
        >
          {isPrivacyModeEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Saldo do fluxo de caixa
        </p>
        <h1 className={`text-2xl font-bold ${getBalanceColorClass()} mb-3`}>
          {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(balance)}
        </h1>
        {accumulatedBalance !== null && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Saldo Acumulado:{' '}
            <span className={`font-medium ${getAccumulatedBalanceColorClass()}`}>
              {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(accumulatedBalance)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
