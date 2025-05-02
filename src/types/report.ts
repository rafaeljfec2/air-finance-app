export interface ReportCategory {
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
  income: ReportSummary;
  expenses: ReportSummary;
  balance: ReportBalance;
}

export type MonthlyReport = Report;
