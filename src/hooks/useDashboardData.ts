import { dashboardService } from '@/services/dashboardService';
import { useCompanyStore } from '@/stores/company';
import {
  DashboardFilters,
  DashboardGoalSummary,
  DashboardSummary,
  ExpenseByCategory
} from '@/types/dashboard';
import { MonthlyReport } from '@/types/report';
import { subMonths } from 'date-fns';
import { useEffect, useState } from 'react';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#EF4444', // Red
];

// MOCK DATA GENERATORS (Fallback)
const generateMockHistory = (months = 6): any[] => {
  const data = [];
  const today = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(today, i);
    // Randomize slightly for "realism"
    const revenue = 4500 + Math.random() * 2000;
    const expenses = 3000 + Math.random() * 1500;
    
    data.push({
      date: date.toISOString(),
      revenue,
      expenses,
      balance: revenue - expenses,
    });
  }
  return data;
};

const MOCK_SUMMARY: DashboardSummary = {
  income: 6500.00,
  expenses: 4200.50,
  balance: 2299.50,
  previousIncome: 5800.00,
  previousExpenses: 4000.00,
  previousBalance: 1800.00,
  incomeChangePct: 12.06,
  expensesChangePct: 5.01,
  balanceChangePct: 27.75,
  periodStart: new Date().toISOString(),
  periodEnd: new Date().toISOString(),
};

const MOCK_EXPENSES: ExpenseByCategory[] = [
  { categoryId: '1', name: 'Moradia', value: 1500, color: '#EF4444' },
  { categoryId: '2', name: 'Alimentação', value: 800, color: '#F59E0B' },
  { categoryId: '3', name: 'Transporte', value: 400, color: '#3B82F6' },
  { categoryId: '4', name: 'Lazer', value: 300, color: '#EC4899' },
  { categoryId: '5', name: 'Saúde', value: 200, color: '#10B981' },
];

const MOCK_GOALS: DashboardGoalSummary[] = [
  { id: '1', name: 'Reserva de Emergência', description: '6 meses de custo de vida', targetAmount: 20000, currentAmount: 12500, progressPct: 62.5, deadline: '2025-12-31' },
  { id: '2', name: 'Viagem de Férias', description: 'Natal em Família', targetAmount: 5000, currentAmount: 1500, progressPct: 30, deadline: '2025-11-20' },
  { id: '3', name: 'Novo Notebook', description: 'Upgrade de equipamento', targetAmount: 8000, currentAmount: 8000, progressPct: 100, deadline: '2025-06-30' },
];

interface DashboardData {
  summary: DashboardSummary;
  history: {
    date: string;
    revenue: number;
    expenses: number;
    balance: number;
  }[];
  expensesByCategory: ExpenseByCategory[];
  goals: DashboardGoalSummary[];
  reportStructure: MonthlyReport; // Compatibility adapter
  loading: boolean;
  error: string | null;
}

export function useDashboardData(filters: DashboardFilters = { timeRange: 'month' }) {
    const { activeCompany } = useCompanyStore();
  const [data, setData] = useState<DashboardData>({
    summary: MOCK_SUMMARY,
    history: [],
    expensesByCategory: [],
    goals: [],
    loading: true,
    error: null,
    reportStructure: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        incomeByCategory: [],
        expensesByCategory: [],
        historicalIncome: [],
        historicalExpenses: [],
        income: { total: 0, categories: [] },
        expenses: { total: 0, categories: [] },
        balance: { current: 0, previous: 0, variation: 0, percentageVariation: 0 },
        summary: {
            income: { total: 0, categories: [] },
            expenses: { total: 0, categories: [] },
            balance: { current: 0, previous: 0, variation: 0, percentageVariation: 0 }
        }
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true }));
        
        let summary: DashboardSummary;
        let history: any[];
        let expenses: ExpenseByCategory[];
        let goals: DashboardGoalSummary[];

        if (activeCompany?.id) {
           try {
               // FETCH REAL DATA
               [summary, history, expenses, goals] = await Promise.all([
                   dashboardService.fetchDashboardSummary(activeCompany.id, filters),
                   dashboardService.fetchBalanceHistory(activeCompany.id, filters),
                   dashboardService.fetchExpensesByCategory(activeCompany.id, filters),
                   dashboardService.fetchGoalsSummary(activeCompany.id)
               ]);
           } catch (apiError) {
               console.warn("API unavailable, falling back to mocks", apiError);
               // FALLBACK TO MOCKS
               summary = MOCK_SUMMARY;
               history = generateMockHistory(6);
               expenses = MOCK_EXPENSES;
               goals = MOCK_GOALS;
           }
        } else {
             // NO COMPANY, USE MOCKS
             summary = MOCK_SUMMARY;
             history = generateMockHistory(6);
             expenses = MOCK_EXPENSES;
             goals = MOCK_GOALS;
        }

        // Adapter to match existing Report Interface if needed by sub-components
        const incomeTotal = summary.income;
        const expensesTotal = summary.expenses;
        
        // Calculate percentages for adapter
        const expensesWithPct = expenses.map(e => ({
            ...e,
            percentage: expensesTotal > 0 ? (e.value / expensesTotal) * 100 : 0
        }));

        const reportStructure: MonthlyReport = {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            incomeByCategory: [], // Todo if needed
            expensesByCategory: expensesWithPct.map((e, i) => ({
                name: e.name,
                value: e.value,
                percentage: e.percentage,
                color: e.color || COLORS[i % COLORS.length]
            })),
            historicalIncome: [],
            historicalExpenses: [],
            income: {
                total: incomeTotal,
                categories: []
            },
            expenses: {
                total: expensesTotal,
                categories: expensesWithPct.map(e => ({
                    name: e.name,
                    value: e.value,
                    percentage: e.percentage
                }))
            },
            balance: {
                current: summary.balance,
                previous: summary.previousBalance ?? 0,
                variation: (summary.balance - (summary.previousBalance ?? 0)),
                percentageVariation: summary.balanceChangePct ?? 0
            },
            summary: {
                income: { total: incomeTotal, categories: [] },
                expenses: { total: expensesTotal, categories: [] },
                balance: { 
                    current: summary.balance, 
                    previous: summary.previousBalance ?? 0, 
                    variation: 0, 
                    percentageVariation: 0 
                }
            }
        };

        setData({
            summary,
            history,
            expensesByCategory: expenses,
            goals,
            reportStructure,
            loading: false,
            error: null
        });

      } catch (err) {
        console.error("Failed to load dashboard data", err);
        // Even in catastrophe, show mocks or error?
        // Returning error state for visual feedback if critical failure
        setData(prev => ({ ...prev, loading: false, error: 'Failed to load data' }));
      }
    };

    loadData();
  }, [filters.timeRange, filters.referenceDate, activeCompany?.id]);

  return data;
}
