export type CreditUtilizationStatus = 'low' | 'moderate' | 'high' | 'critical';
export type LiquidityStatus = 'positive' | 'negative' | 'critical';

export interface CreditUtilization {
  used: number;
  available: number;
  total: number;
  percentage: number;
  status: CreditUtilizationStatus;
}

export interface Liquidity {
  available: number;
  obligations: number;
  ratio: number;
  status: LiquidityStatus;
}

export interface DebtToRevenue {
  debt: number;
  monthlyRevenue: number;
  percentage: number;
}

export interface AccountBalances {
  positive: number;
  negative: number;
  net: number;
}

export interface IndebtednessMetrics {
  creditUtilization: CreditUtilization;
  totalDebt: number;
  liquidity: Liquidity;
  debtToRevenue: DebtToRevenue;
  accountBalances: AccountBalances;
}
