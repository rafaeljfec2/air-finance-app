import { useState, useEffect, useCallback } from 'react';
import { useStatementStore } from '@/stores/statement';
import { MonthlyReport } from '@/types/report';
import { getCategoriesByType } from '@/constants/categories';
import { parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function useMonthlyReport() {
  const { transactions } = useStatementStore();
  const [date, setDate] = useState<Date>(new Date());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateReport = useCallback(() => {
    setIsLoading(true);

    try {
      const month = date.getMonth();
      const year = date.getFullYear();
      const firstDay = startOfMonth(new Date(year, month));
      const lastDay = endOfMonth(new Date(year, month));

      // Filter current month transactions
      const monthTransactions = transactions.filter(t => {
        const transactionDate = parseISO(t.data);
        return isWithinInterval(transactionDate, { start: firstDay, end: lastDay });
      });

      // Filter previous month transactions for variation calculation
      const previousMonth = startOfMonth(new Date(year, month - 1));
      const lastDayPrevious = endOfMonth(new Date(year, month - 1));
      const previousMonthTransactions = transactions.filter(t => {
        const transactionDate = parseISO(t.data);
        return isWithinInterval(transactionDate, { start: previousMonth, end: lastDayPrevious });
      });

      // Group transactions by category
      const groupByCategory = (type: 'RECEITA' | 'DESPESA') => {
        const categories = getCategoriesByType(type);
        const total = monthTransactions
          .filter(t => t.tipo === type)
          .reduce((acc, t) => acc + t.valor, 0);

        return categories.map(category => {
          const categoryTransactions = monthTransactions.filter(
            t => t.tipo === type && t.categoria.id === category.id
          );
          const categoryTotal = categoryTransactions.reduce((acc, t) => acc + t.valor, 0);

          return {
            id: category.id,
            name: category.nome,
            icon: category.icone,
            color: category.cor,
            total: categoryTotal,
            percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
            transactions: categoryTransactions.map(t => ({
              id: t.id,
              description: t.descricao,
              amount: t.valor,
              date: parseISO(t.data),
            })),
          };
        });
      };

      // Calculate totals
      const totalIncome = monthTransactions
        .filter(t => t.tipo === 'RECEITA')
        .reduce((acc, t) => acc + t.valor, 0);
      const totalExpenses = monthTransactions
        .filter(t => t.tipo === 'DESPESA')
        .reduce((acc, t) => acc + t.valor, 0);

      // Calculate previous month balance
      const previousBalance =
        previousMonthTransactions
          .filter(t => t.tipo === 'RECEITA')
          .reduce((acc, t) => acc + t.valor, 0) -
        previousMonthTransactions
          .filter(t => t.tipo === 'DESPESA')
          .reduce((acc, t) => acc + t.valor, 0);

      const currentBalance = totalIncome - totalExpenses;
      const variation = currentBalance - previousBalance;
      const percentageVariation = previousBalance !== 0 ? (variation / previousBalance) * 100 : 0;

      const summary = {
        income: {
          total: totalIncome,
          categories: groupByCategory('RECEITA'),
        },
        expenses: {
          total: totalExpenses,
          categories: groupByCategory('DESPESA'),
        },
        balance: {
          current: currentBalance,
          previous: previousBalance,
          variation,
          percentageVariation,
        },
      };

      setReport({
        month,
        year,
        summary,
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  }, [date, transactions]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const previousMonth = useCallback(() => {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  return {
    date,
    report,
    isLoading,
    previousMonth,
    nextMonth,
  };
}
