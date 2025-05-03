import { z } from 'zod';
import apiClient from './apiClient';

export const DependentSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  relation: z.enum(['filho', 'conjuge', 'pai', 'mae', 'outro'], {
    errorMap: () => ({ message: 'Relação inválida' }),
  }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  userId: z.string(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateDependentSchema = DependentSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type Dependent = z.infer<typeof DependentSchema>;
export type CreateDependent = z.infer<typeof CreateDependentSchema>;

export const getDependents = async (): Promise<Dependent[]> => {
  try {
    const response = await apiClient.get<Dependent[]>('/dependents');
    return DependentSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar dependentes:', error);
    throw new Error('Falha ao buscar dependentes');
  }
};

export const getDependentById = async (id: string): Promise<Dependent> => {
  try {
    const response = await apiClient.get<Dependent>(`/dependents/${id}`);
    return DependentSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar dependente:', error);
    throw new Error('Falha ao buscar dependente');
  }
};

export const createDependent = async (data: CreateDependent): Promise<Dependent> => {
  try {
    const validatedData = CreateDependentSchema.parse(data);
    const response = await apiClient.post<Dependent>('/dependents', validatedData);
    return DependentSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar dependente:', error);
    throw new Error('Falha ao criar dependente');
  }
};

export const updateDependent = async (
  id: string,
  data: Partial<CreateDependent>,
): Promise<Dependent> => {
  try {
    const validatedData = CreateDependentSchema.partial().parse(data);
    const response = await apiClient.put<Dependent>(`/dependents/${id}`, validatedData);
    return DependentSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar dependente:', error);
    throw new Error('Falha ao atualizar dependente');
  }
};

export const deleteDependent = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/dependents/${id}`);
  } catch (error) {
    console.error('Erro ao deletar dependente:', error);
    throw new Error('Falha ao deletar dependente');
  }
};
