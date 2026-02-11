import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import { Eye, EyeOff } from 'lucide-react';
import type { CashInsight } from '../hooks/useHomePageData';

interface HomeHeaderProps {
  readonly balance: number;
  readonly accumulatedBalance: number | null;
  readonly cashInsight: CashInsight;
  readonly isPrivacyModeEnabled: boolean;
  readonly onTogglePrivacyMode: () => void;
}

const INSIGHT_TONE_CLASSES: Record<CashInsight['tone'], string> = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  neutral: 'text-gray-500 dark:text-gray-400',
};

export function HomeHeader({
  balance,
  accumulatedBalance,
  cashInsight,
  isPrivacyModeEnabled,
  onTogglePrivacyMode,
}: Readonly<HomeHeaderProps>) {
  const { user } = useAuth();

  const balanceColorClass = isPrivacyModeEnabled
    ? 'text-gray-900 dark:text-white'
    : balance >= 0
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-red-600 dark:text-red-400';

  const accumulatedColorClass = isPrivacyModeEnabled
    ? 'text-gray-500 dark:text-gray-400'
    : accumulatedBalance !== null && accumulatedBalance >= 0
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Olá, {user?.name?.split(' ')[0]}</p>
        <button
          onClick={onTogglePrivacyMode}
          className="text-gray-400 hover:text-primary-500 flex-shrink-0 transition-colors"
          aria-label={isPrivacyModeEnabled ? 'Mostrar saldo' : 'Ocultar saldo'}
        >
          {isPrivacyModeEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saldo do fluxo de caixa</p>
        <h1 className={`text-2xl font-bold ${balanceColorClass} mb-1.5`}>
          {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(balance)}
        </h1>

        {!isPrivacyModeEnabled && (
          <p className={`text-xs ${INSIGHT_TONE_CLASSES[cashInsight.tone]} mb-3`}>
            {cashInsight.label}
          </p>
        )}

        {accumulatedBalance !== null && (
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Acumulado no período:{' '}
              <span className={`font-medium ${accumulatedColorClass}`}>
                {isPrivacyModeEnabled ? 'R$ ••••••' : formatCurrency(accumulatedBalance)}
              </span>
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Entradas menos saídas dos últimos 30 dias
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
