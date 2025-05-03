import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const AccountSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.enum(['checking', 'savings', 'investment']),
  balance: z.number(),
  institution: z.string(),
  agency: z.string(),
  accountNumber: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  balance: true,
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;

// Service functions
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await apiClient.get<Account[]>('/accounts');
    return AccountSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    throw new Error('Falha ao buscar contas');
  }
};

export const getAccountById = async (id: string): Promise<Account> => {
  try {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return AccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    throw new Error('Falha ao buscar conta');
  }
};

export const createAccount = async (data: CreateAccount): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.parse(data);
    const response = await apiClient.post<Account>('/accounts', validatedData);
    return AccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    throw new Error('Falha ao criar conta');
  }
};

export const updateAccount = async (id: string, data: Partial<CreateAccount>): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.partial().parse(data);
    const response = await apiClient.put<Account>(`/accounts/${id}`, validatedData);
    return AccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    throw new Error('Falha ao atualizar conta');
  }
};

export const deleteAccount = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/accounts/${id}`);
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    throw new Error('Falha ao deletar conta');
  }
};

export const getAccountBalance = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.get<{ balance: number }>(`/accounts/${id}/balance`);
    return response.data.balance;
  } catch (error) {
    console.error('Erro ao buscar saldo da conta:', error);
    throw new Error('Falha ao buscar saldo da conta');
  }
};
