import { Home, ArrowRightLeft, Plus, ChartBar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  href?: string;
  onClick?: () => void;
  isSpecial?: boolean;
}

interface MobileBottomNavProps {
  readonly onNewTransaction: () => void;
}

export function MobileBottomNav({ onNewTransaction }: Readonly<MobileBottomNavProps>) {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/home',
    },
    {
      id: 'transactions',
      label: 'Transações',
      icon: ArrowRightLeft,
      href: '/transactions',
    },
    {
      id: 'add',
      label: 'Adicionar',
      icon: Plus,
      onClick: onNewTransaction,
      isSpecial: true,
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: ChartBar,
      href: '/reports',
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      href: '/profile',
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card-dark border-t border-border dark:border-border-dark shadow-lg"
      style={{
        paddingBottom:
          'max(env(safe-area-inset-bottom, constant(safe-area-inset-bottom, 0px)), 0.5rem)',
      }}
      aria-label="Navegação principal móvel"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          // Botão especial (Add) - Destacado
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center relative group"
                aria-label={item.label}
              >
                <div className="absolute -top-6 w-14 h-14 bg-primary-600 dark:bg-primary-500 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 group-hover:bg-primary-700">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] mt-8 font-medium text-primary-600 dark:text-primary-400">
                  {item.label}
                </span>
              </button>
            );
          }

          // Botões normais
          const content = (
            <>
              <Icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400',
                )}
              />
              <span
                className={cn(
                  'text-[10px] mt-1 font-medium transition-colors',
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400',
                )}
              >
                {item.label}
              </span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                to={item.href}
                className="flex flex-col items-center justify-center transition-transform active:scale-95"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center transition-transform active:scale-95"
              aria-label={item.label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
