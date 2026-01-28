import { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Banknote,
  Wallet,
  Landmark,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Account } from '@/services/accountService';

interface AccountDetailsHeaderProps {
  readonly account: Account | null;
  readonly accounts: Account[];
  readonly onAccountSelect: (accountId: string) => void;
  readonly onMenuClick?: () => void;
  readonly month?: string;
  readonly onPreviousMonth?: () => void;
  readonly onNextMonth?: () => void;
  readonly canGoPrevious?: boolean;
  readonly canGoNext?: boolean;
}

const getAccountIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Wallet':
      return Wallet;
    case 'Landmark':
      return Landmark;
    case 'Banknote':
    default:
      return Banknote;
  }
};

export function AccountDetailsHeader({
  account,
  accounts,
  onAccountSelect,
  onMenuClick,
  month,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious = true,
  canGoNext = true,
}: AccountDetailsHeaderProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleAccountSelect = (accountId: string) => {
    onAccountSelect(accountId);
    setIsOpen(false);
  };

  const hasMultipleAccounts = accounts.length > 1;
  const accountColor = account?.color ?? '#8A05BE';
  const AccountIcon = getAccountIcon(account?.icon);

  const formatMonth = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-').map(Number);
    const date = new Date(year, monthNum - 1, 1);
    return format(date, 'MMMM/yyyy', { locale: ptBR });
  };

  return (
    <div
      className="sticky top-0 z-10 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accountColor} 0%, ${accountColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      <div className="relative">
        <div className="flex items-center justify-between px-4 pt-safe pb-3 min-h-[56px] gap-2">
          <button
            onClick={() => navigate('/accounts')}
            className="text-white hover:opacity-80 p-2 transition-opacity backdrop-blur-sm bg-white/10 rounded-full shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {hasMultipleAccounts ? (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center justify-center gap-2 min-w-0 px-3 hover:opacity-90 transition-opacity backdrop-blur-sm bg-white/10 rounded-lg py-1.5 max-w-[calc(100%-8rem)]">
                  <AccountIcon className="h-4 w-4 text-white shrink-0" />
                  <h1 className="text-sm font-bold text-white uppercase truncate text-center">
                    {account?.name ?? 'CONTA BANCÁRIA'}
                  </h1>
                  <ChevronDown className="h-3.5 w-3.5 text-white shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="center">
                <div className="max-h-[300px] overflow-y-auto">
                  {accounts.map((acc) => {
                    const Icon = getAccountIcon(acc.icon);
                    return (
                      <button
                        key={acc.id}
                        onClick={() => handleAccountSelect(acc.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors flex items-center gap-2 ${
                          acc.id === account?.id
                            ? 'bg-gray-100 dark:bg-gray-800/50 text-text dark:text-text-dark font-medium'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 text-text dark:text-text-dark'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: acc.color ?? '#8A05BE' }}
                        >
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="truncate">{acc.name}</span>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 min-w-0 px-3 max-w-[calc(100%-8rem)]">
              <AccountIcon className="h-4 w-4 text-white shrink-0" />
              <h1 className="text-sm font-bold text-white uppercase truncate text-center">
                {account?.name ?? 'CONTA BANCÁRIA'}
              </h1>
            </div>
          )}

          <button
            onClick={onMenuClick}
            className="text-white hover:opacity-80 p-2 transition-opacity backdrop-blur-sm bg-white/10 rounded-full shrink-0"
            aria-label="Menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {month && onPreviousMonth && onNextMonth && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onPreviousMonth}
                disabled={!canGoPrevious}
                className="text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all backdrop-blur-sm bg-white/15 hover:bg-white/25 active:scale-95 disabled:active:scale-100"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex-1 flex items-center justify-center gap-2 px-4">
                <Calendar className="h-4 w-4 text-white/90 shrink-0" />
                <h2 className="text-base font-bold text-white text-center capitalize tracking-wide">
                  {formatMonth(month)}
                </h2>
              </div>

              <button
                onClick={onNextMonth}
                disabled={!canGoNext}
                className="text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all backdrop-blur-sm bg-white/15 hover:bg-white/25 active:scale-95 disabled:active:scale-100"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
