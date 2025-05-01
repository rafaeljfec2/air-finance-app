import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { Icon } from '@/components/Icon';
import { ViewDefault } from '@/layouts/ViewDefault';

export function Settings() {
  const navigate = useNavigate();
  const { 
    theme,
    toggleTheme,
    notifications,
    toggleNotifications,
    currency,
    setCurrency,
    biometrics,
    toggleBiometrics,
    closingDay,
    setClosingDay,
    appVersion
  } = useSettings();

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Configurações
        </h1>

        {/* Personalização */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Personalização
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="SunIcon" className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Tema</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {theme === 'dark' ? 'Escuro' : 'Claro'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    style={{ backgroundColor: theme === 'dark' ? '#4F46E5' : '#D1D5DB' }}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="BellIcon" className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Notificações</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notifications ? 'Ativadas' : 'Desativadas'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleNotifications}
                    className="ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    style={{ backgroundColor: notifications ? '#4F46E5' : '#D1D5DB' }}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="CurrencyDollarIcon" className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Moeda</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{currency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrency('BRL')}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dados e Privacidade */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Dados e Privacidade
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="FingerPrintIcon" className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Segurança</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {biometrics ? 'Biometria ativada' : 'Biometria desativada'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleBiometrics}
                    className="ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    style={{ backgroundColor: biometrics ? '#4F46E5' : '#D1D5DB' }}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        biometrics ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="ArrowDownTrayIcon" className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Exportar dados</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Baixar suas informações
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/settings/export')}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gerenciamento */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Gerenciamento
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate('/settings/categories')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="TagIcon" className="text-gray-400 mr-3" size={20} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Categorias</p>
                  </div>
                  <Icon name="ChevronRightIcon" className="text-gray-400" size={20} />
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate('/settings/accounts')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="CreditCardIcon" className="text-gray-400 mr-3" size={20} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Contas bancárias</p>
                  </div>
                  <Icon name="ChevronRightIcon" className="text-gray-400" size={20} />
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate('/settings/cards')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="CreditCardIcon" className="text-gray-400 mr-3" size={20} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Cartões de crédito</p>
                  </div>
                  <Icon name="ChevronRightIcon" className="text-gray-400" size={20} />
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate('/settings/goals')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="FlagIcon" className="text-gray-400 mr-3" size={20} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Metas financeiras</p>
                  </div>
                  <Icon name="ChevronRightIcon" className="text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferências Financeiras */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Preferências Financeiras
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="CalendarIcon" className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dia de fechamento</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dia {closingDay} de cada mês
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setClosingDay(5)}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Sobre
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="InformationCircleIcon" className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Versão do aplicativo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{appVersion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ViewDefault>
  );
} 