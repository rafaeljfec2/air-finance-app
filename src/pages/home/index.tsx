import { useAuth } from '@/hooks/useAuth';
import { useDashboardBalanceHistory, useDashboardRecentTransactions } from '@/hooks/useDashboard';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowRightLeft,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Files,
  Flag,
  Import,
  Plus,
  X,
} from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuickActionCard } from './components/QuickActionCard';
import { Dialog, Transition } from '@headlessui/react';

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const [showBalance, setShowBalance] = useState(true);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Data fetching
  const companyId = activeCompany?.id || '';

  const filters = useMemo(
    () => ({
      timeRange: 'month' as const,
      referenceDate: new Date().toISOString(),
    }),
    [],
  );

  const balanceQuery = useDashboardBalanceHistory(companyId, filters);
  const transactionsQuery = useDashboardRecentTransactions(companyId, filters, 5);

  const balance =
    balanceQuery.data && balanceQuery.data.length > 0
      ? balanceQuery.data[balanceQuery.data.length - 1].balance
      : 0;

  const quickActions = [
    {
      label: 'Novo Lançamento',
      icon: Plus,
      href: '#', // Handled by onClick
      onClick: () => setIsTypeModalOpen(true),
      color: 'bg-primary-500',
      className:
        'col-span-2 bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20',
    },
    { label: 'Contas', icon: CreditCard, href: '/accounts', color: 'bg-purple-500' },
    { label: 'Extrato', icon: Import, href: '/import-ofx', color: 'bg-green-500' },
    { label: 'Metas', icon: Flag, href: '/goals', color: 'bg-amber-500' },
    {
      label: 'Fluxo de Caixa',
      icon: ArrowRightLeft,
      href: '/transactions',
      color: 'bg-orange-500',
    },
    { label: 'Relatórios', icon: Files, href: '/reports', color: 'bg-blue-500' },
  ];

  return (
    <ViewDefault>
      <div className="flex flex-col min-h-[calc(100vh-6rem)] pb-20 md:pb-0 max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {/* Header Section */}
        <header className="bg-white dark:bg-card-dark px-6 pt-8 md:pt-6 pb-6 rounded-b-[2rem] md:rounded-2xl shadow-sm relative z-10 md:col-span-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Olá, {user?.name?.split(' ')[0]}
              </p>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showBalance ? formatCurrency(balance) : 'R$ ••••••'}
                </h1>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-primary-500"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>

          {/* Monthly Summary Bar - Placeholder for logic */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Receitas vs Despesas</span>
              <span className="font-medium text-gray-900 dark:text-white">Jan/2026</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
              {/* Example visual progress */}
              <div className="h-full bg-emerald-500 w-[60%]"></div>
              <div className="h-full bg-red-500 w-[20%]"></div>
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span>Entradas: +R$ 5.000</span>
              <span>Saídas: -R$ 1.200</span>
            </div>
          </div>
        </header>

        {/* Quick Actions Grid */}
        <div className="px-6 py-6 md:px-0 md:col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={action.label}
                {...action}
                className={
                  index === 0 || action.label === 'Fluxo de Caixa'
                    ? 'col-span-2 aspect-[2/1] flex-row gap-3'
                    : 'aspect-square col-span-1'
                }
              />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-6 flex-1 md:px-0 md:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Últimas Transações
            </h2>
            <Link
              to="/transactions"
              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {transactionsQuery.data?.map((tx) => (
              <div
                key={tx.id}
                className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${tx.launchType === 'revenue' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                  >
                    <ArrowRightLeft size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {tx.description}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {format(new Date(tx.paymentDate), "d 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${tx.launchType === 'revenue' ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {tx.launchType === 'revenue' ? '+' : '-'}
                  {formatCurrency(Math.abs(tx.value))}
                </span>
              </div>
            ))}

            {(!transactionsQuery.data || transactionsQuery.data.length === 0) && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Nenhuma transação recente.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Type Selection Modal */}
      <Transition appear show={isTypeModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsTypeModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Nova Transação
                    </Dialog.Title>
                    <button
                      onClick={() => setIsTypeModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate('/transactions/new?type=REVENUE')}
                      className="flex flex-col items-center justify-center p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
                    >
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                        <ArrowRightLeft className="w-6 h-6 rotate-90 sm:rotate-0" />
                      </div>
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">
                        Receita
                      </span>
                    </button>

                    <button
                      onClick={() => navigate('/transactions/new?type=EXPENSE')}
                      className="flex flex-col items-center justify-center p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                    >
                      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 mb-3 group-hover:scale-110 transition-transform">
                        <ArrowRightLeft className="w-6 h-6 rotate-90 sm:rotate-0" />
                      </div>
                      <span className="font-medium text-red-700 dark:text-red-300">Despesa</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ViewDefault>
  );
}
