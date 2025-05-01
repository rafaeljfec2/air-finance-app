import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/stores/useTheme';

export function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-10 relative">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Air Finance
          </h1>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Botão de Tema */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {/* Notificações */}
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="sr-only">Ver notificações</span>
                  <div className="relative">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                      2
                    </span>
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Notificações
                      </h2>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <Menu.Item>
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            Nova transação registrada
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Há 5 minutos
                          </p>
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            Limite de orçamento atingido
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Há 2 horas
                          </p>
                        </div>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          {/* Menu do Usuário */}
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-2">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-5 w-5" />
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">Rafael Silva</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Conta Pessoal
                      </span>
                    </div>
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/profile')}
                          className={cn(
                            'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300',
                            active && 'bg-gray-100 dark:bg-gray-700'
                          )}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          Meu Perfil
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/settings')}
                          className={cn(
                            'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300',
                            active && 'bg-gray-100 dark:bg-gray-700'
                          )}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          Configurações
                        </button>
                      )}
                    </Menu.Item>
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={cn(
                            'flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400',
                            active && 'bg-gray-100 dark:bg-gray-700'
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          Sair
                        </button>
                      )}
                    </Menu.Item>
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
