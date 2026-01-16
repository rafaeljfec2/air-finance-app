import { Menu, Transition } from '@headlessui/react';
import { CircleUser, Eye, EyeOff, LifeBuoy, LogOut, Settings } from 'lucide-react';
import { Fragment } from 'react';
import { UserMenuItem } from './UserMenuItem';

interface UserMenuProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isHeaderVisible: boolean;
  onToggleHeaderVisibility: () => void;
  onOpenSupport: () => void;
}

export function UserMenu({
  onNavigate,
  onLogout,
  isHeaderVisible,
  onToggleHeaderVisibility,
  onOpenSupport,
}: Readonly<UserMenuProps>) {
  return (
    <Menu as="div" className="relative">
      {() => (
        <>
          <Menu.Button className="flex items-center justify-center min-h-[44px] min-w-[44px] text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 p-2">
            <span className="sr-only">Abrir menu do usuário</span>
            <CircleUser className="h-8 w-8 text-text dark:text-text-dark" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 right-safe lg:right-0 mt-2 w-48 origin-top-right rounded-md bg-card dark:bg-card-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-w-[calc(100vw-var(--safe-area-inset-left)-var(--safe-area-inset-right)-1rem)]">
              <div className="py-1">
                <UserMenuItem
                  icon={CircleUser}
                  label="Meu Perfil"
                  onClick={() => onNavigate('/profile')}
                />
                <UserMenuItem
                  icon={Settings}
                  label="Configurações"
                  onClick={() => onNavigate('/settings')}
                />
                <UserMenuItem
                  icon={isHeaderVisible ? EyeOff : Eye}
                  label={isHeaderVisible ? 'Esconder Header' : 'Mostrar Header'}
                  onClick={onToggleHeaderVisibility}
                />
                <UserMenuItem
                  icon={LifeBuoy}
                  label="Suporte"
                  onClick={onOpenSupport}
                  variant="emerald"
                />
                <div className="border-t border-border dark:border-border-dark">
                  <UserMenuItem icon={LogOut} label="Sair" onClick={onLogout} />
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
