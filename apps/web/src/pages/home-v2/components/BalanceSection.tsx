import { formatCurrency } from '@/utils/formatters';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BalanceSectionProps {
  balance: number;
  accumulatedBalance: number | null;
  isPrivacyModeEnabled: boolean;
  onTogglePrivacyMode: () => void;
}

export function BalanceSection({
  balance,
  accumulatedBalance,
  isPrivacyModeEnabled,
  onTogglePrivacyMode,
}: Readonly<BalanceSectionProps>) {
  const getBalanceColorClass = (): string => {
    if (isPrivacyModeEnabled) {
      return 'text-gray-900 dark:text-white';
    }
    return balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
  };

  const getAccumulatedBalanceColorClass = (): string => {
    if (isPrivacyModeEnabled) {
      return 'text-gray-700 dark:text-gray-300';
    }
    return accumulatedBalance !== null && accumulatedBalance >= 0
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Saldo</span>
          <button
            onClick={onTogglePrivacyMode}
            className="text-gray-400 hover:text-primary-500 transition-colors"
            aria-label={isPrivacyModeEnabled ? 'Mostrar saldo' : 'Ocultar saldo'}
          >
            {isPrivacyModeEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        <Link
          to="/dashboard"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Ver Detalhes
        </Link>
      </div>

      <div className="space-y-2">
        <h2 className={`text-3xl font-bold ${getBalanceColorClass()}`}>
          {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(balance)}
        </h2>

        {accumulatedBalance !== null && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Saldo Acumulado:{' '}
            <span className={`font-semibold ${getAccumulatedBalanceColorClass()}`}>
              {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(accumulatedBalance)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
