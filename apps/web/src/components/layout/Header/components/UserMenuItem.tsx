import { Menu } from '@headlessui/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'emerald';
}

export function UserMenuItem({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}: Readonly<UserMenuItemProps>) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={cn(
            active ? 'bg-background dark:bg-background-dark' : '',
            'flex w-full items-center px-4 py-2 text-sm',
            variant === 'emerald'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-text dark:text-text-dark',
          )}
        >
          <Icon className="mr-3 h-5 w-5" />
          {label}
        </button>
      )}
    </Menu.Item>
  );
}
