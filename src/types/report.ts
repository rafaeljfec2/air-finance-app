export interface ReportCategory {
  percentage: any;
  name: string;
  value: number;
}

export interface ReportSummary {
  total: number;
  categories: ReportCategory[];
}

export interface ReportBalance {
  current: number;
  previous: number;
  variation: number;
  percentageVariation: number;
}

export interface Report {
  month: number;
  year: number;
  incomeByCategory: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  expensesByCategory: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  historicalIncome: any[];
  historicalExpenses: any[];
  income: ReportSummary;
  expenses: ReportSummary;
  balance: ReportBalance;
  summary: {
    income: ReportSummary;
    expenses: ReportSummary;
    balance: {
      current: number;
      previous: number;
      variation: number;
      percentageVariation: number;
    };
  };
}

export type MonthlyReport = Report;
