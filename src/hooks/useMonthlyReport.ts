import { useMemo, useState } from 'react';
import { useStatementStore } from '@/store/statement';
import { getCategoriesByType } from '@/utils/categories';
import { Transaction, Category } from '@/types';
import { MonthlyReport, ReportCategory } from '@/types/report';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#EF4444', // Red
];

export function useMonthlyReportMemo(transactions: Transaction[]): MonthlyReport {
  return useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);

    const incomeCategories = getCategoriesByType('INCOME').map((category: Category) => ({
      name: category.name,
      value: transactions
        .filter(t => t.type === 'INCOME' && t.category.id === category.id)
        .reduce((acc, t) => acc + t.amount, 0),
    }));

    const expenseCategories = getCategoriesByType('EXPENSE').map((category: Category) => ({
      name: category.name,
      value: transactions
        .filter(t => t.type === 'EXPENSE' && t.category.id === category.id)
        .reduce((acc, t) => acc + t.amount, 0),
    }));

    const report: MonthlyReport = {
      summary: {
        income: {
          total: income,
          categories: incomeCategories,
        },
        expenses: {
          total: expenses,
          categories: expenseCategories,
        },
        balance: {
          current: income - expenses,
          previous: 0, // TODO: Implement previous month calculation
          variation: 0, // TODO: Implement variation calculation
        },
      },
    };

    return report;
  }, [transactions]);
}

export function useMonthlyReport(month: number, year: number) {
  const { transactions } = useStatementStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(year, month));

  const report = useMemo(() => {
    const filteredTransactions = transactions.filter(
      (transaction: Transaction) => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentDate.getMonth() && 
               date.getFullYear() === currentDate.getFullYear();
      }
    );

    const income = filteredTransactions.filter((t: Transaction) => t.type === 'INCOME');
    const expenses = filteredTransactions.filter((t: Transaction) => t.type === 'EXPENSE');

    const incomeTotal = income.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    const expensesTotal = expenses.reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const incomeByCategory = income.reduce((acc: Record<string, number>, t: Transaction) => {
      const category = t.category.name;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

    const expensesByCategory = expenses.reduce((acc: Record<string, number>, t: Transaction) => {
      const category = t.category.name;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

    const currentBalance = incomeTotal - expensesTotal;
    const previousBalance = 0; // TODO: Implement previous month calculation
    const balanceVariation = currentBalance - previousBalance;
    const percentageVariation = previousBalance !== 0 
      ? (balanceVariation / Math.abs(previousBalance)) * 100 
      : 0;

    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      incomeByCategory: Object.entries(incomeByCategory).map(([name, value], index) => ({
        name,
        value: value as number,
        color: COLORS[index % COLORS.length],
        percentage: (value as number / incomeTotal) * 100
      })),
      expensesByCategory: Object.entries(expensesByCategory).map(([name, value], index) => ({
        name,
        value: value as number,
        color: COLORS[index % COLORS.length],
        percentage: (value as number / expensesTotal) * 100
      })),
      historicalIncome: [], // TODO: Implement historical data
      historicalExpenses: [], // TODO: Implement historical data
      income: {
        total: incomeTotal,
        categories: Object.entries(incomeByCategory).map(([name, value]): ReportCategory => ({
          name,
          value: value as number
        }))
      },
      expenses: {
        total: expensesTotal,
        categories: Object.entries(expensesByCategory).map(([name, value]): ReportCategory => ({
          name,
          value: value as number
        }))
      },
      balance: {
        current: currentBalance,
        previous: previousBalance,
        variation: balanceVariation,
        percentageVariation
      }
    };
  }, [transactions, currentDate]);

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return {
    date: currentDate,
    report,
    isLoading,
    previousMonth,
    nextMonth
  };
}
