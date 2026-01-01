import { IndebtednessCard } from '@/components/dashboard/IndebtednessCard';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Banknote } from 'lucide-react';
import { useState } from 'react';

export function FinancialHealthPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  /* const [showGoalsModal, setShowGoalsModal] = useState(false); - Future implementation for specific modal */

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    await queryClient.invalidateQueries({ queryKey: ['indebtedness'] });
    setIsRefreshing(false);
  };

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

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6 pt-0 pb-6 px-6"
        >
          {/* Header */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Banknote className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Saúde Financeira
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Análise global e metas de longo prazo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
            <motion.div variants={item} className="w-full">
              <IndebtednessCard companyId={companyId} />
            </motion.div>
          </div>
        </motion.div>
      </PullToRefresh>
    </ViewDefault>
  );
}
