import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

interface TransactionSummaryProps {
  totalCredits: number;
  totalDebits: number;
  finalBalance: number;
}

export function TransactionSummary({
  totalCredits,
  totalDebits,
  finalBalance,
}: TransactionSummaryProps) {
  return (
    <>
      {/* Desktop Summary - Cards grandes */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 animate-in slide-in-from-top-2 duration-200">
        <Card className="p-4 bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</p>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalCredits)}
                </h3>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <ArrowDownCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</p>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                  -{formatCurrency(totalDebits)}
                </h3>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${finalBalance >= 0 ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <Wallet className={`h-4 w-4 ${finalBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo do Período</p>
                <h3 className={`text-xl font-bold ${finalBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(finalBalance)}
                </h3>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile Summary - Compacto e horizontal */}
      <div className="md:hidden mb-3">
        <Card className="p-3 bg-card dark:bg-card-dark border-border dark:border-border-dark">
          <div className="flex items-center justify-between gap-3">
            {/* Receitas */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1 mb-1">
                <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Receitas</span>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(totalCredits)}
              </span>
            </div>

            <div className="h-10 w-px bg-border dark:bg-border-dark"></div>

            {/* Despesas */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1 mb-1">
                <ArrowDownCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Despesas</span>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                -{formatCurrency(totalDebits)}
              </span>
            </div>

            <div className="h-10 w-px bg-border dark:bg-border-dark"></div>

            {/* Saldo */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1 mb-1">
                <Wallet className={`h-3.5 w-3.5 ${finalBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Saldo</span>
              </div>
              <span className={`text-sm font-bold ${finalBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(finalBalance)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
