import { apiClient } from './apiClient';
import { z } from 'zod';

// Validation schemas
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
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
  balance: true,
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;

// Service functions
export const getAccounts = async (companyId: string): Promise<Account[]> => {
  try {
    const response = await apiClient.get<Account[]>(`/companies/${companyId}/accounts`);
    return AccountSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    throw new Error('Falha ao buscar contas' + error);
  }
};

export const getAccountById = async (companyId: string, id: string): Promise<Account> => {
  try {
    const response = await apiClient.get<Account>(`/companies/${companyId}/accounts/${id}`);
    return AccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    throw new Error('Falha ao buscar conta');
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
    console.error('Erro ao criar conta:', error);
    throw new Error('Falha ao criar conta');
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
    console.error('Erro ao atualizar conta:', error);
    throw new Error('Falha ao atualizar conta');
  }
};

export const deleteAccount = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/accounts/${id}`);
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
