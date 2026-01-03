import { useAuth } from '@/hooks/useAuth';
import { useDashboardBalanceHistory, useDashboardRecentTransactions } from '@/hooks/useDashboard';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { usePreferencesStore } from '@/stores/preferences';
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
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuickActionCard } from './components/QuickActionCard';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';

export function HomePage() {
  const { user } = useAuth();
  const { activeCompany } = useCompanyStore();
  const { isPrivacyModeEnabled, togglePrivacyMode } = usePreferencesStore();
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
                  {!isPrivacyModeEnabled ? formatCurrency(balance) : 'R$ ••••••'}
                </h1>
                <button
                  onClick={togglePrivacyMode}
                  className="text-gray-400 hover:text-primary-500"
                >
                  {!isPrivacyModeEnabled ? <EyeOff size={20} /> : <Eye size={20} />}
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

      {/* Type Selection Modal - Now using reusable component */}
      <TransactionTypeModal isOpen={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)} />
    </ViewDefault>
  );
}
