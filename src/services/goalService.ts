import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const GoalSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  targetAmount: z.number().min(0, 'Valor alvo deve ser maior que zero'),
  currentAmount: z.number().min(0, 'Valor atual não pode ser negativo'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data limite inválida'),
  status: z.enum(['active', 'completed', 'cancelled']),
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
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const response = await apiClient.get<Goal[]>('/goals');
    return GoalSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    throw new Error('Falha ao buscar metas');
  }
};

export const getGoalById = async (id: string): Promise<Goal> => {
  try {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return GoalSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar meta:', error);
    throw new Error('Falha ao buscar meta');
  }
};

export const createGoal = async (data: CreateGoal): Promise<Goal> => {
  try {
    const validatedData = CreateGoalSchema.parse(data);
    const response = await apiClient.post<Goal>('/goals', validatedData);
    return GoalSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    throw new Error('Falha ao criar meta');
  }
};

export const updateGoal = async (id: string, data: Partial<CreateGoal>): Promise<Goal> => {
  try {
    const validatedData = CreateGoalSchema.partial().parse(data);
    const response = await apiClient.put<Goal>(`/goals/${id}`, validatedData);
    return GoalSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    throw new Error('Falha ao atualizar meta');
  }
};

export const deleteGoal = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/goals/${id}`);
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    throw new Error('Falha ao deletar meta');
  }
};

export const getGoalProgress = async (
  id: string,
): Promise<{
  progress: number;
  remainingAmount: number;
  daysUntilDeadline: number;
}> => {
  try {
    const response = await apiClient.get(`/goals/${id}/progress`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar progresso da meta:', error);
    throw new Error('Falha ao buscar progresso da meta');
  }
};
