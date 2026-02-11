import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import { Eye, EyeOff } from 'lucide-react';
import type { CashInsight } from '../hooks/useHomePageData';

interface HomeHeaderProps {
  readonly balance: number;
  readonly accumulatedBalance: number | null;
  readonly cashInsight: CashInsight;
  readonly cashStatusLine: string;
  readonly isPrivacyModeEnabled: boolean;
  readonly onTogglePrivacyMode: () => void;
}

const INSIGHT_TONE_CLASSES: Record<CashInsight['tone'], string> = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  neutral: 'text-gray-500 dark:text-gray-400',
};

function resolveBalanceColor(isPrivacy: boolean, balance: number): string {
  if (isPrivacy) return 'text-gray-900 dark:text-white';
  return balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
}

function resolveAccumulatedColor(isPrivacy: boolean, accumulated: number | null): string {
  if (isPrivacy) return 'text-gray-500 dark:text-gray-400';
  const isPositive = accumulated !== null && accumulated >= 0;
  return isPositive ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
}

export function HomeHeader({
  balance,
  accumulatedBalance,
  cashInsight,
  cashStatusLine,
  isPrivacyModeEnabled,
  onTogglePrivacyMode,
}: Readonly<HomeHeaderProps>) {
  const { user } = useAuth();

  const balanceColorClass = resolveBalanceColor(isPrivacyModeEnabled, balance);
  const accumulatedColorClass = resolveAccumulatedColor(isPrivacyModeEnabled, accumulatedBalance);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {'Ol\u00E1, '}
          {user?.name?.split(' ')[0]}
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Caixa atual</p>
        <h1 className={`text-2xl font-bold ${balanceColorClass} mb-1.5`}>
          {isPrivacyModeEnabled
            ? 'R$ \u2022\u2022\u2022\u2022\u2022\u2022'
            : formatCurrency(balance)}
        </h1>

        {!isPrivacyModeEnabled && (
          <p className={`text-xs ${INSIGHT_TONE_CLASSES[cashInsight.tone]} mb-3`}>
            {cashStatusLine}
          </p>
        )}

        {accumulatedBalance !== null && (
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {'Resultado l\u00EDquido: '}
              <span className={`font-medium ${accumulatedColorClass}`}>
                {isPrivacyModeEnabled
                  ? 'R$ \u2022\u2022\u2022\u2022\u2022\u2022'
                  : formatCurrency(accumulatedBalance)}
              </span>
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              {'Entradas menos sa\u00EDdas \u00B7 \u00FAltimos 30 dias'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
