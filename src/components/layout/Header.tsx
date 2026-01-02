import { Logo } from '@/components/Logo';
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useTheme } from '@/stores/useTheme';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowRightLeft,
  ChartBar,
  CircleUser,
  Import,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Plus,
  Settings,
  Sun
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
          className="lg:hidden mr-2 min-h-[44px] min-w-[44px] p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center"
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

          {/* Atalhos Rápidos */}
          <div className="hidden md:flex items-center border-l dark:border-gray-700 pl-4 space-x-1">
             <button
                onClick={() => navigate('/transactions/new')}
                className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center"
                title="Nova Transação"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center"
                title="Fluxo de Caixa"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/import-ofx')}
                className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center"
                title="Importar Extrato"
              >
                <Import className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center"
                title="Relatórios"
              >
                <ChartBar className="h-5 w-5" />
              </button>
          </div>

          {/* Botão de Tema */}
          <button
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] p-2 text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notificações */}
          <NotificationsMenu />

          {/* Menu do Usuário */}
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
