import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';
import { companyService } from './companyService';

// Validation schemas
export const UserSchema = z.object({
  id: z.string(),
  companyIds: z.array(z.string()),
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
  integrations: z
    .object({
      openaiApiKey: z.string().optional(),
      openaiModel: z
        .enum(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-5.2', 'gpt-5-mini'])
        .optional(),
    })
    .optional(),
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
    const response = await apiClient.get<User[]>('/user');
    return UserSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Falha ao buscar usuários');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/user/${id}`);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Falha ao buscar usuário');
  }
};

export const createUser = async (data: CreateUser): Promise<User> => {
  try {
    const validatedData = CreateUserSchema.parse(data);
    const response = await apiClient.post<User>('/user', validatedData);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Falha ao criar usuário');
  }
};

export const updateUser = async (id: string, data: Partial<CreateUser>): Promise<User> => {
  try {
    const validatedData = CreateUserSchema.partial().parse(data);
    const response = await apiClient.put<User>(`/user/${id}`, validatedData);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Falha ao atualizar usuário');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/user/${id}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Falha ao deletar usuário');
  }
};

/**
 * Finds a user by email address
 * @param email - The email address of the user to find
 * @returns The user object if found, or throws an error if not found
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const users = await getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Usuário não encontrado com o email fornecido');
    }
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    throw parseApiError(error);
  }
};

/**
 * Deletes all user data including companies, accounts, transactions, categories, goals, etc.
 * This is a destructive operation that permanently removes all data associated with the user.
 * It deletes all companies owned by the user (which should cascade delete related entities),
 * then deletes the user account itself.
 *
 * @param userId - The ID of the user whose data should be deleted
 * @throws Error if deletion fails at any step
 */
export const deleteAllUserData = async (userId: string): Promise<void> => {
  try {
    // First, try to use a dedicated endpoint if available
    try {
      await apiClient.delete(`/user/${userId}/all-data`);
      return;
    } catch (error) {
      // Check if it's a 404 error (endpoint doesn't exist)
      const apiError = parseApiError(error);
      if (apiError.status === 404) {
        // If dedicated endpoint doesn't exist (404), fall back to manual deletion
        // Continue to the fallback logic below
      } else {
        // For any other error, re-throw it
        throw error;
      }
    }

    // Fallback: manually delete companies then user
    // This assumes the backend cascades deletions from companies

    // Get all companies and filter by userIds since there's no /user/:id/companies endpoint
    const allCompanies = await companyService.getAll();
    const userCompanies = allCompanies.filter((company) => company.userIds.includes(userId));

    // Delete all companies owned by this user
    // This should cascade delete related entities (accounts, transactions, categories, goals, etc)
    if (userCompanies.length > 0) {
      await Promise.all(userCompanies.map((company) => companyService.delete(company.id)));
    }

    // Finally, delete the user account
    await apiClient.delete(`/user/${userId}`);
  } catch (error) {
    console.error('Erro ao deletar todos os dados do usuário:', error);
    throw parseApiError(error);
  }
};

/**
 * Deletes all user data by email address
 * This is a convenience function that finds the user by email and then deletes all their data.
 *
 * @param email - The email address of the user whose data should be deleted
 * @throws Error if user is not found or deletion fails at any step
 */
export const deleteAllUserDataByEmail = async (email: string): Promise<void> => {
  try {
    const user = await getUserByEmail(email);
    await deleteAllUserData(user.id);
  } catch (error) {
    console.error('Erro ao deletar todos os dados do usuário por email:', error);
    throw parseApiError(error);
  }
};
