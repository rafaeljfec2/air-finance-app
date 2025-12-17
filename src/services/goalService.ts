import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

// Validation schemas
export const GoalSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  targetAmount: z.number().min(0, 'Valor alvo deve ser maior que zero'),
  currentAmount: z.number().min(0, 'Valor atual não pode ser negativo'),
  deadline: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Data limite inválida'),
  status: z.enum(['active', 'completed', 'cancelled']),
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateGoalSchema = GoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Goal = z.infer<typeof GoalSchema>;
export type CreateGoal = z.infer<typeof CreateGoalSchema>;

// Service functions
export const getGoals = async (companyId: string): Promise<Goal[]> => {
  try {
    const response = await apiClient.get<Goal[]>(`/companies/${companyId}/goals`);
    return GoalSchema.array().parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getGoalById = async (companyId: string, id: string): Promise<Goal> => {
  try {
    const response = await apiClient.get<Goal>(`/companies/${companyId}/goals/${id}`);
    return GoalSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const createGoal = async (companyId: string, data: CreateGoal): Promise<Goal> => {
  try {
    const validatedData = CreateGoalSchema.parse(data);
    const response = await apiClient.post<Goal>(`/companies/${companyId}/goals`, validatedData);
    return GoalSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateGoal = async (
  companyId: string,
  id: string,
  data: Partial<CreateGoal>,
): Promise<Goal> => {
  try {
    const validatedData = CreateGoalSchema.partial().parse(data);
    const response = await apiClient.put<Goal>(
      `/companies/${companyId}/goals/${id}`,
      validatedData,
    );
    return GoalSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const deleteGoal = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/goals/${id}`);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getGoalProgress = async (
  companyId: string,
  id: string,
): Promise<{
  progress: number;
  remainingAmount: number;
  daysUntilDeadline: number;
}> => {
  try {
    const response = await apiClient.get(`/companies/${companyId}/goals/${id}/progress`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateGoalCurrentAmount = async (
  companyId: string,
  id: string,
  currentAmount: number,
): Promise<Goal> => {
  try {
    const response = await apiClient.patch<Goal>(
      `/companies/${companyId}/goals/${id}/current-amount`,
      { currentAmount },
    );
    return GoalSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
