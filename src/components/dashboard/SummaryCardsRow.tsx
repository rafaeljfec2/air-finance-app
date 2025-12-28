import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardSummary } from '@/hooks/useDashboard';
import type { DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Clock, PieChart, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useEffect } from 'react';

interface SummaryCardsRowProps {
  companyId: string;
  filters: DashboardFilters;
}

function formatChangeLabel(pct: number | null): { text: string; className: string } {
  if (pct === null) {
    return { text: 'Sem comparação com período anterior', className: 'text-gray-500' };
  }

  const rounded = Number.isFinite(pct) ? pct.toFixed(1) : '0.0';
  const sign = pct >= 0 ? '+' : '';
  const isPositive = pct >= 0;
  return {
    text: `${sign}${rounded}% vs mês anterior`,
    className: isPositive ? 'text-green-500' : 'text-red-500',
  };
}

function AnimatedValue({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 1000 });
  const display = useTransform(spring, (current) => formatCurrency(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function SummaryCardsRow({ companyId, filters }: Readonly<SummaryCardsRowProps>) {
  const { data, isLoading, error } = useDashboardSummary(companyId, filters);

  if (!companyId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white dark:bg-gray-800 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 p-6 col-span-3">
          <div className="flex items-center gap-3 text-sm text-red-500">
            <Spinner size="sm" className="text-red-500" />
            <span>Erro ao carregar resumo financeiro do dashboard.</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const balanceChange = formatChangeLabel(data.balanceChangePct);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Saldo Total */}
      <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="bg-white dark:bg-card-dark p-6 h-full border-l-4 border-l-blue-500 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                <AnimatedValue value={data.balance} />
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full shadow-inner ring-1 ring-blue-500/10">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp
              className={`h-4 w-4 mr-1 ${
                data.balanceChangePct !== null && data.balanceChangePct < 0
                  ? 'text-red-500 rotate-180'
                  : 'text-green-500'
              }`}
            />
            <span className={balanceChange.className}>{balanceChange.text}</span>
          </div>
        </Card>
      </motion.div>

      {/* Receitas */}
      <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="bg-white dark:bg-card-dark p-6 h-full border-l-4 border-l-green-500 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                <AnimatedValue value={data.income} />
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full shadow-inner ring-1 ring-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-500">Última atualização: agora</span>
          </div>
        </Card>
      </motion.div>

      {/* Despesas */}
      <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="bg-white dark:bg-card-dark p-6 h-full border-l-4 border-l-red-500 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                <AnimatedValue value={data.expenses} />
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full shadow-inner ring-1 ring-red-500/10">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <PieChart className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-500">Ver distribuição</span>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
