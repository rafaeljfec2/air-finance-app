import { z } from 'zod';
import { apiClient } from './apiClient';

// Validation schemas
export const UserSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['admin', 'user'], {
    errorMap: () => ({ message: 'Função inválida' }),
  }),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;

// Service functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users');
    return UserSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Falha ao buscar usuários');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Falha ao buscar usuário');
  }
};

export const createUser = async (data: CreateUser): Promise<User> => {
  try {
    const validatedData = CreateUserSchema.parse(data);
    const response = await apiClient.post<User>('/users', validatedData);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Falha ao criar usuário');
  }
};

export const updateUser = async (id: string, data: Partial<CreateUser>): Promise<User> => {
  try {
    const validatedData = CreateUserSchema.partial().parse(data);
    const response = await apiClient.put<User>(`/users/${id}`, validatedData);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Falha ao atualizar usuário');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Falha ao deletar usuário');
  }
};
