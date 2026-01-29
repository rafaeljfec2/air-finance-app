import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, MoreVertical, Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Account } from '@/services/accountService';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { AccountBalanceCard } from './AccountBalanceCard';
import { AddAccountCard } from './AddAccountCard';

interface AccountCardsContainerProps {
  readonly accounts: ReadonlyArray<Account>;
  readonly selectedAccountId: string;
  readonly onAccountSelect: (accountId: string) => void;
  readonly onMenuClick?: () => void;
  readonly onEditAccount?: (account: Account) => void;
  readonly onToggleAutoSync?: (account: Account) => void;
  readonly onDeleteAccount?: (account: Account) => void;
  readonly onAddAccount?: () => void;
}

const SCROLL_CONFIG = {
  cardWidth: 280,
  gap: 12,
  padding: 16,
} as const;

export function AccountCardsContainer({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onMenuClick,
  onEditAccount,
  onToggleAutoSync,
  onDeleteAccount,
  onAddAccount,
}: Readonly<AccountCardsContainerProps>) {
  const navigate = useNavigate();

  const selectedIndex = useMemo(
    () => accounts.findIndex((acc) => acc.id === selectedAccountId),
    [accounts, selectedAccountId],
  );

  const totalItems = onAddAccount ? accounts.length + 1 : accounts.length;

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollTo } = useHorizontalScroll(
    totalItems,
    selectedIndex,
    SCROLL_CONFIG,
  );

  const handleBack = () => navigate('/accounts');

  return (
    <div className="bg-background-dark dark:bg-background-dark sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 pt-safe pb-3 min-h-[56px] gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="text-text dark:text-text-dark hover:opacity-80 p-2 transition-opacity bg-card dark:bg-card-dark rounded-full shrink-0 border border-border dark:border-border-dark"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-bold text-text dark:text-text-dark flex-1 text-center">
          Contas Bancárias
        </h1>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="text-text dark:text-text-dark hover:opacity-80 p-2 transition-opacity bg-card dark:bg-card-dark rounded-full shrink-0 border border-border dark:border-border-dark"
              aria-label="Menu"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] bg-card dark:bg-card-dark rounded-lg shadow-lg border border-border dark:border-border-dark p-1 z-50"
              sideOffset={5}
              align="end"
            >
              {onAddAccount && (
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text dark:text-text-dark rounded-md cursor-pointer outline-none hover:bg-background dark:hover:bg-background-dark transition-colors"
                  onSelect={() => onAddAccount()}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Conta
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-text dark:text-text-dark rounded-md cursor-pointer outline-none hover:bg-background dark:hover:bg-background-dark transition-colors"
                onSelect={() => onMenuClick?.()}
              >
                <Menu className="h-4 w-4" />
                Menu Principal
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="relative pb-4">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollTo('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: '16px',
            scrollPaddingRight: '16px',
          }}
        >
          {accounts.map((account) => (
            <div key={account.id} style={{ scrollSnapAlign: 'start' }}>
              <AccountBalanceCard
                account={account}
                isSelected={account.id === selectedAccountId}
                onClick={() => onAccountSelect(account.id)}
                onEdit={onEditAccount}
                onToggleAutoSync={onToggleAutoSync}
                onDelete={onDeleteAccount}
              />
            </div>
          ))}
          {onAddAccount && (
            <div style={{ scrollSnapAlign: 'start' }}>
              <AddAccountCard onClick={onAddAccount} />
            </div>
          )}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollTo('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="h-5 w-5 text-text dark:text-text-dark" />
          </button>
        )}
      </div>
    </div>
  );
}
