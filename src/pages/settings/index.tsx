import { useSettings } from '@/hooks/useSettings';
import { ViewDefault } from '@/layouts/ViewDefault';
import {
    Bell,
    Calendar,
    ChevronRight,
    CreditCard,
    DollarSign,
    Download,
    Fingerprint,
    Flag,
    Info,
    Settings as SettingsIcon,
    Sun,
    Tag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    appVersion,
  } = useSettings();

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Configurações</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie as configurações do seu aplicativo
              </p>
            </div>
          </div>

          {/* Personalização */}
          <section className="bg-card dark:bg-card-dark rounded-lg shadow mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-text dark:text-text-dark">Personalização</h2>
            </div>
            <div className="border-t border-border dark:border-border-dark">
              <div className="divide-y divide-border dark:divide-border-dark">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sun className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">Tema</p>
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
                      <Bell className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Notificações
                        </p>
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
                      <DollarSign className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">Moeda</p>
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
          <section className="bg-card dark:bg-card-dark rounded-lg shadow mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-text dark:text-text-dark">
                Dados e Privacidade
              </h2>
            </div>
            <div className="border-t border-border dark:border-border-dark">
              <div className="divide-y divide-border dark:divide-border-dark">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Fingerprint className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Segurança
                        </p>
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
                      <Download className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Exportar dados
                        </p>
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
          <section className="bg-card dark:bg-card-dark rounded-lg shadow mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-text dark:text-text-dark">Gerenciamento</h2>
            </div>
            <div className="border-t border-border dark:border-border-dark">
              <div className="divide-y divide-border dark:divide-border-dark">
                <div
                  className="px-4 py-5 sm:px-6 hover:bg-background dark:hover:bg-background-dark cursor-pointer"
                  onClick={() => navigate('/settings/categories')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tag className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        Categorias
                      </p>
                    </div>
                    <ChevronRight className="text-gray-500 dark:text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div
                  className="px-4 py-5 sm:px-6 hover:bg-background dark:hover:bg-background-dark cursor-pointer"
                  onClick={() => navigate('/settings/accounts')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        Contas bancárias
                      </p>
                    </div>
                    <ChevronRight className="text-gray-500 dark:text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div
                  className="px-4 py-5 sm:px-6 hover:bg-background dark:hover:bg-background-dark cursor-pointer"
                  onClick={() => navigate('/settings/cards')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        Cartões de crédito
                      </p>
                    </div>
                    <ChevronRight className="text-gray-500 dark:text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div
                  className="px-4 py-5 sm:px-6 hover:bg-background dark:hover:bg-background-dark cursor-pointer"
                  onClick={() => navigate('/settings/goals')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Flag className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        Metas financeiras
                      </p>
                    </div>
                    <ChevronRight className="text-gray-500 dark:text-gray-400 h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferências Financeiras */}
          <section className="bg-card dark:bg-card-dark rounded-lg shadow mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-text dark:text-text-dark">
                Preferências Financeiras
              </h2>
            </div>
            <div className="border-t border-border dark:border-border-dark">
              <div className="divide-y divide-border dark:divide-border-dark">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Dia de fechamento
                        </p>
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
          <section className="bg-card dark:bg-card-dark rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-text dark:text-text-dark">Sobre</h2>
            </div>
            <div className="border-t border-border dark:border-border-dark">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Info className="text-gray-500 dark:text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        Versão do aplicativo
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{appVersion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


        </div>
      </div>
    </ViewDefault>
  );
}
