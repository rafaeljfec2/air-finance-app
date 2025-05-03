import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const InvestmentSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.enum(['stocks', 'bonds', 'funds', 'crypto', 'real_estate']),
  amount: z.number(),
  currentValue: z.number(),
  institution: z.string(),
  accountNumber: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateInvestmentSchema = InvestmentSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  currentValue: true,
});

export type Investment = z.infer<typeof InvestmentSchema>;
export type CreateInvestment = z.infer<typeof CreateInvestmentSchema>;

// Service functions
export const getInvestments = async (): Promise<Investment[]> => {
  try {
    const response = await apiClient.get<Investment[]>('/investments');
    return InvestmentSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
    throw new Error('Falha ao buscar investimentos');
  }
};

export const getInvestmentById = async (id: string): Promise<Investment> => {
  try {
    const response = await apiClient.get<Investment>(`/investments/${id}`);
    return InvestmentSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar investimento:', error);
    throw new Error('Falha ao buscar investimento');
  }
};

export const createInvestment = async (data: CreateInvestment): Promise<Investment> => {
  try {
    const validatedData = CreateInvestmentSchema.parse(data);
    const response = await apiClient.post<Investment>('/investments', validatedData);
    return InvestmentSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar investimento:', error);
    throw new Error('Falha ao criar investimento');
  }
};

export const updateInvestment = async (
  id: string,
  data: Partial<CreateInvestment>,
): Promise<Investment> => {
  try {
    const validatedData = CreateInvestmentSchema.partial().parse(data);
    const response = await apiClient.put<Investment>(`/investments/${id}`, validatedData);
    return InvestmentSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar investimento:', error);
    throw new Error('Falha ao atualizar investimento');
  }
};

export const deleteInvestment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/investments/${id}`);
  } catch (error) {
    console.error('Erro ao deletar investimento:', error);
    throw new Error('Falha ao deletar investimento');
  }
};

export const getInvestmentPerformance = async (
  id: string,
  startDate: string,
  endDate: string,
): Promise<{
  totalReturn: number;
  percentageReturn: number;
  historicalData: Array<{
    date: string;
    value: number;
  }>;
}> => {
  try {
    const response = await apiClient.get(`/investments/${id}/performance`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar performance do investimento:', error);
    throw new Error('Falha ao buscar performance do investimento');
  }
};
