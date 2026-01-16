import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';
import type { IndebtednessMetrics } from '@/types/indebtedness';

const CreditUtilizationStatusSchema = z.enum(['low', 'moderate', 'high', 'critical']);
const LiquidityStatusSchema = z.enum(['positive', 'negative', 'critical']);

const CreditUtilizationSchema = z.object({
  used: z.number(),
  available: z.number(),
  total: z.number(),
  percentage: z.number(),
  status: CreditUtilizationStatusSchema,
});

const LiquiditySchema = z.object({
  available: z.number(),
  obligations: z.number(),
  ratio: z.number(),
  status: LiquidityStatusSchema,
});

const DebtToRevenueSchema = z.object({
  debt: z.number(),
  monthlyRevenue: z.number(),
  percentage: z.number(),
});

const AccountBalancesSchema = z.object({
  positive: z.number(),
  negative: z.number(),
  net: z.number(),
});

const IndebtednessMetricsSchema = z.object({
  creditUtilization: CreditUtilizationSchema,
  totalDebt: z.number(),
  liquidity: LiquiditySchema,
  debtToRevenue: DebtToRevenueSchema,
  accountBalances: AccountBalancesSchema,
});

export const getIndebtednessMetrics = async (
  companyId: string,
): Promise<IndebtednessMetrics> => {
  try {
    const response = await apiClient.get<IndebtednessMetrics>(
      `/companies/${companyId}/indebtedness`,
    );
    return IndebtednessMetricsSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

