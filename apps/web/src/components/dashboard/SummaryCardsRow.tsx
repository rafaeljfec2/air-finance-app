import { Card } from '@/components/ui/card';
import { useDashboardSummary } from '@/hooks/useDashboard';
import type { DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useEffect } from 'react';

interface SummaryCardsRowProps {
  companyId: string;
  filters: DashboardFilters;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20 p-6">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <TrendingDown className="h-5 w-5" />
          <span>Erro ao carregar dados do dashboard. Tente atualizar a página.</span>
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-3 md:gap-6"
    >
      {/* Saldo Total - Theme Compliant Premium Card */}
      <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white dark:bg-card-dark p-2.5 md:p-6 shadow-md border border-gray-100 dark:border-border-dark group h-full flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-1 md:w-1.5 h-full bg-blue-500 rounded-r-xl md:rounded-r-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
          {/* Subtle gradient glow for premium feel without breaking theme */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between gap-1.5 md:gap-0">
            <div className="flex items-center justify-between md:mb-4">
              <div className="p-1.5 md:p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                <Wallet className="h-3.5 w-3.5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className={`flex items-center text-[8px] md:text-xs font-medium px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full ${data.balanceChangePct && data.balanceChangePct >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                 <TrendingUp className={`h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1 ${data.balanceChangePct && data.balanceChangePct < 0 ? 'rotate-180' : ''}`} />
                 {data.balanceChangePct ? `${Math.abs(data.balanceChangePct).toFixed(1)}%` : '0%'}
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-[9px] md:text-sm font-medium mb-0.5 md:mb-1 leading-tight">Saldo Total</p>
              <h3 className="text-sm md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                <AnimatedValue value={data.balance} />
              </h3>
              <p className="hidden md:flex text-xs text-gray-400 dark:text-gray-500 mt-2 items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                 Saldo real atualizado
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Receitas - Theme Compliant Premium Card */}
      <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
         <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white dark:bg-card-dark p-2.5 md:p-6 shadow-md border border-gray-100 dark:border-border-dark group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-1 md:w-1.5 h-full bg-emerald-500 rounded-r-xl md:rounded-r-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-1.5 md:gap-0">
              <div className="flex items-center justify-between md:mb-4">
                 <div className="p-1.5 md:p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg md:rounded-xl">
                    <TrendingUp className="h-3.5 w-3.5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
                 </div>
                  <div className={`flex items-center text-[8px] md:text-xs font-medium px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full ${data.incomeChangePct && data.incomeChangePct >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                   {data.incomeChangePct ? `${data.incomeChangePct > 0 ? '+' : ''}${data.incomeChangePct.toFixed(1)}%` : '-'}
                </div>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[9px] md:text-sm font-medium mb-0.5 md:mb-1 leading-tight">Receitas</p>
                <h3 className="text-sm md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                  <AnimatedValue value={data.income} />
                </h3>
              </div>
            </div>
         </div>
      </motion.div>

      {/* Despesas - Theme Compliant Premium Card */}
      <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
         <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white dark:bg-card-dark p-2.5 md:p-6 shadow-md border border-gray-100 dark:border-border-dark group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-1 md:w-1.5 h-full bg-rose-500 rounded-r-xl md:rounded-r-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-1.5 md:gap-0">
              <div className="flex items-center justify-between md:mb-4">
                 <div className="p-1.5 md:p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-lg md:rounded-xl">
                    <TrendingDown className="h-3.5 w-3.5 md:h-6 md:w-6 text-rose-600 dark:text-rose-400" />
                 </div>
                  <div className={`flex items-center text-[8px] md:text-xs font-medium px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full ${data.expensesChangePct && data.expensesChangePct > 0 ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                   {data.expensesChangePct ? `${data.expensesChangePct > 0 ? '+' : ''}${data.expensesChangePct.toFixed(1)}%` : '-'}
                </div>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[9px] md:text-sm font-medium mb-0.5 md:mb-1 leading-tight">Despesas</p>
                <h3 className="text-sm md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                  <AnimatedValue value={data.expenses} />
                </h3>
              </div>
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
}
