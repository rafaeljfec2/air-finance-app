import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useTheme } from '@/stores/useTheme';
import { Menu, Transition } from '@headlessui/react';
import {
    Bell,
    CircleUser,
    LogOut,
    Menu as MenuIcon,
    Moon,
    Settings,
    Sun,
} from 'lucide-react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySelector } from './CompanySelector';

export function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-card dark:bg-card-dark border-b border-border dark:border-border-dark shadow-sm z-20 relative">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Botão hambúrguer mobile */}
        <button
          className="lg:hidden mr-2 p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Ações do Header */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Company Selector */}
          <div className="hidden lg:block">
            <CompanySelector />
          </div>

          {/* Botão de Tema */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          {/* Notificações */}
          <Menu as="div" className="relative">
            {() => (
              <>
                <Menu.Button className="p-1.5 sm:p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="sr-only">Ver notificações</span>
                  <div className="relative">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] sm:text-xs text-white">
                      2
                    </span>
                  </div>
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
                  <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-card dark:bg-card-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-text dark:text-text-dark">
                        Notificações
                      </div>
                      <div className="border-t border-border dark:border-border-dark">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={cn(
                                active ? 'bg-background dark:bg-background-dark' : '',
                                'block w-full text-left px-4 py-2 text-sm text-text dark:text-text-dark',
                              )}
                            >
                              Nova transação registrada
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={cn(
                                active ? 'bg-background dark:bg-background-dark' : '',
                                'block w-full text-left px-4 py-2 text-sm text-text dark:text-text-dark',
                              )}
                            >
                              Lembrete de fatura
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          {/* Menu do Usuário */}
          <Menu as="div" className="relative">
            {() => (
              <>
                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
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
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-card dark:bg-card-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/profile')}
                            className={cn(
                              active ? 'bg-background dark:bg-background-dark' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-text dark:text-text-dark',
                            )}
                          >
                            <CircleUser className="mr-3 h-5 w-5" />
                            Meu Perfil
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/settings')}
                            className={cn(
                              active ? 'bg-background dark:bg-background-dark' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-text dark:text-text-dark',
                            )}
                          >
                            <Settings className="mr-3 h-5 w-5" />
                            Configurações
                          </button>
                        )}
                      </Menu.Item>
                      <div className="border-t border-border dark:border-border-dark">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                active ? 'bg-background dark:bg-background-dark' : '',
                                'flex w-full items-center px-4 py-2 text-sm text-text dark:text-text-dark',
                              )}
                            >
                              <LogOut className="mr-3 h-5 w-5" />
                              Sair
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
}
