import { useMemo, useState } from 'react';
import { useStatementStore } from '@/stores/statement';
import { getCategoriesByType } from '@/utils/categories';
import { Transaction, Category } from '@/types';
import { MonthlyReport } from '@/types/report';

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
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      incomeByCategory: incomeCategories.map((category, index) => ({
        ...category,
        color: COLORS[index % COLORS.length],
        percentage: (category.value / income) * 100
      })),
      expensesByCategory: expenseCategories.map((category, index) => ({
        ...category,
        color: COLORS[index % COLORS.length],
        percentage: (category.value / expenses) * 100
      })),
      historicalIncome: [],
      historicalExpenses: [],
      income: {
        total: income,
        categories: incomeCategories.map((category) => ({
          ...category,
          percentage: (category.value / income) * 100
        }))
      },
      expenses: {
        total: expenses,
        categories: expenseCategories.map((category) => ({
          ...category,
          percentage: (category.value / expenses) * 100
        }))
      },
      balance: {
        current: income - expenses,
        previous: 0,
        variation: 0,
        percentageVariation: 0
      },
      summary: {
        income: {
          total: income,
          categories: incomeCategories.map((category) => ({
            ...category,
            percentage: (category.value / income) * 100
          }))
        },
        expenses: {
          total: expenses,
          categories: expenseCategories.map((category) => ({
            ...category,
            percentage: (category.value / expenses) * 100
          }))
        },
        balance: {
          current: income - expenses,
          previous: 0,
          variation: 0,
          percentageVariation: 0
        }
      }
    };

    return report;
  }, [transactions]);
}

export function useMonthlyReport(month: number, year: number) {
  const { transactions } = useStatementStore();
  const [date, setDate] = useState(new Date(year, month));

  const report = useMemo(() => {
    const filteredTransactions = transactions.filter(
      (transaction: Transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
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

    const incomeCategories = Object.entries(incomeByCategory).map(([name, value]) => ({
      name,
      value: value as number
    }));

    const expenseCategories = Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value: value as number
    }));

    const report: MonthlyReport = {
      month: date.getMonth(),
      year: date.getFullYear(),
      incomeByCategory: incomeCategories.map((category, index) => ({
        ...category,
        color: COLORS[index % COLORS.length],
        percentage: (category.value / incomeTotal) * 100
      })),
      expensesByCategory: expenseCategories.map((category, index) => ({
        ...category,
        color: COLORS[index % COLORS.length],
        percentage: (category.value / expensesTotal) * 100
      })),
      historicalIncome: [],
      historicalExpenses: [],
      income: {
        total: incomeTotal,
        categories: incomeCategories.map((category) => ({
          ...category,
          percentage: (category.value / incomeTotal) * 100
        }))
      },
      expenses: {
        total: expensesTotal,
        categories: expenseCategories.map((category) => ({
          ...category,
          percentage: (category.value / expensesTotal) * 100
        }))
      },
      balance: {
        current: currentBalance,
        previous: previousBalance,
        variation: balanceVariation,
        percentageVariation
      },
      summary: {
        income: {
          total: incomeTotal,
          categories: incomeCategories.map((category) => ({
            ...category,
            percentage: (category.value / incomeTotal) * 100
          }))
        },
        expenses: {
          total: expensesTotal,
          categories: expenseCategories.map((category) => ({
            ...category,
            percentage: (category.value / expensesTotal) * 100
          }))
        },
        balance: {
          current: currentBalance,
          previous: previousBalance,
          variation: balanceVariation,
          percentageVariation
        }
      }
    };

    return report;
  }, [transactions, date]);

  const previousMonth = () => {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return {
    date: date,
    report,
    previousMonth,
    nextMonth
  };
}
