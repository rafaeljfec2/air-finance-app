import { apiClient } from './apiClient';
import { z } from 'zod';
import { parseApiError } from '@/utils/apiErrorHandler';

export const AccountSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['checking', 'savings', 'investment', 'credit_card', 'digital_wallet'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }),
  institution: z.string().min(2, 'Instituição deve ter pelo menos 2 caracteres'),
  agency: z.string().min(4, 'Agência deve ter pelo menos 4 dígitos'),
  accountNumber: z.string().min(5, 'Número da conta deve ter pelo menos 5 dígitos'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  balance: z.number().default(0),
  initialBalance: z.number().default(0),
  initialBalanceDate: z
    .string()
    .transform((date) => {
      if (!date) return null;
      return new Date(date).toISOString();
    })
    .nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  balance: true,
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;

export const getAccounts = async (companyId: string): Promise<Account[]> => {
  try {
    const response = await apiClient.get<Account[]>(`/companies/${companyId}/accounts`);
    return AccountSchema.array().parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getAccountById = async (companyId: string, id: string): Promise<Account> => {
  try {
    const response = await apiClient.get<Account>(`/companies/${companyId}/accounts/${id}`);
    return AccountSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const createAccount = async (companyId: string, data: CreateAccount): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.parse(data);
    const response = await apiClient.post<Account>(
      `/companies/${companyId}/accounts`,
      validatedData,
    );
    return AccountSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateAccount = async (
  companyId: string,
  id: string,
  data: Partial<CreateAccount>,
): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.partial().parse(data);
    const response = await apiClient.patch<Account>(
      `/companies/${companyId}/accounts/${id}`,
      validatedData,
    );
    return AccountSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const deleteAccount = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/accounts/${id}`);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getAccountBalance = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.get<{ balance: number }>(`/accounts/${id}/balance`);
    return response.data.balance;
  } catch (error) {
    throw parseApiError(error);
  }
};
