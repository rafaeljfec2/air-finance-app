import { apiClient } from './apiClient';
import { z } from 'zod';

// Validation schemas
export const IncomeSourceSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  type: z.enum(['fixed', 'variable', 'passive'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
  amount: z.number().min(0, 'Valor deve ser maior que zero'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
    errorMap: () => ({ message: 'Frequência inválida' }),
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início inválida'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de término inválida')
    .optional(),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateIncomeSourceSchema = IncomeSourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type IncomeSource = z.infer<typeof IncomeSourceSchema>;
export type CreateIncomeSource = z.infer<typeof CreateIncomeSourceSchema>;

// Service functions
export const getIncomeSources = async (companyId: string): Promise<IncomeSource[]> => {
  try {
    const response = await apiClient.get<IncomeSource[]>(`/companies/${companyId}/income-sources`);
    return IncomeSourceSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar fontes de receita:', error);
    throw new Error('Falha ao buscar fontes de receita: ' + error);
  }
};

export const getIncomeSourceById = async (companyId: string, id: string): Promise<IncomeSource> => {
  try {
    const response = await apiClient.get<IncomeSource>(
      `/companies/${companyId}/income-sources/${id}`,
    );
    return IncomeSourceSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar fonte de receita:', error);
    throw new Error('Falha ao buscar fonte de receita');
  }
};

export const createIncomeSource = async (
  companyId: string,
  data: CreateIncomeSource,
): Promise<IncomeSource> => {
  try {
    const validatedData = CreateIncomeSourceSchema.parse(data);
    const response = await apiClient.post<IncomeSource>(
      `/companies/${companyId}/income-sources`,
      validatedData,
    );
    return IncomeSourceSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar fonte de receita:', error);
    throw new Error('Falha ao criar fonte de receita');
  }
};

export const updateIncomeSource = async (
  companyId: string,
  id: string,
  data: Partial<CreateIncomeSource>,
): Promise<IncomeSource> => {
  try {
    const validatedData = CreateIncomeSourceSchema.partial().parse(data);
    const response = await apiClient.put<IncomeSource>(
      `/companies/${companyId}/income-sources/${id}`,
      validatedData,
    );
    return IncomeSourceSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar fonte de receita:', error);
    throw new Error('Falha ao atualizar fonte de receita');
  }
};

export const deleteIncomeSource = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/income-sources/${id}`);
  } catch (error) {
    console.error('Erro ao deletar fonte de receita:', error);
    throw new Error('Falha ao deletar fonte de receita');
  }
};

export const getIncomeSourceProjection = async (
  companyId: string,
  id: string,
): Promise<{
  projectedAmount: number;
  nextPaymentDate: string;
  daysUntilNextPayment: number;
}> => {
  try {
    const response = await apiClient.get(`/companies/${companyId}/income-sources/${id}/projection`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar projeção da fonte de receita:', error);
    throw new Error('Falha ao buscar projeção da fonte de receita');
  }
};
