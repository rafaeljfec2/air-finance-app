export interface ReportCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: Date;
  }>;
}

export interface MonthlySummary {
  income: {
    total: number;
    categories: ReportCategory[];
  };
  expenses: {
    total: number;
    categories: ReportCategory[];
  };
  balance: {
    current: number;
    previous: number;
    variation: number;
    percentageVariation: number;
  };
}

export interface MonthlyReport {
  month: number;
  year: number;
  summary: MonthlySummary;
}
