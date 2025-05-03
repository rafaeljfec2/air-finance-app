import { apiClient } from './apiClient';
import { z } from 'zod';

// Validation schemas
export const DigitalAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.enum(['pix', 'digital_wallet', 'payment_app']),
  balance: z.number(),
  institution: z.string(),
  accountNumber: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateDigitalAccountSchema = DigitalAccountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  balance: true,
});

export type DigitalAccount = z.infer<typeof DigitalAccountSchema>;
export type CreateDigitalAccount = z.infer<typeof CreateDigitalAccountSchema>;

// Service functions
export const getDigitalAccounts = async (): Promise<DigitalAccount[]> => {
  try {
    const response = await apiClient.get<DigitalAccount[]>('/digital-accounts');
    return DigitalAccountSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar contas digitais:', error);
    throw new Error('Falha ao buscar contas digitais');
  }
};

export const getDigitalAccountById = async (id: string): Promise<DigitalAccount> => {
  try {
    const response = await apiClient.get<DigitalAccount>(`/digital-accounts/${id}`);
    return DigitalAccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar conta digital:', error);
    throw new Error('Falha ao buscar conta digital');
  }
};

export const createDigitalAccount = async (data: CreateDigitalAccount): Promise<DigitalAccount> => {
  try {
    const validatedData = CreateDigitalAccountSchema.parse(data);
    const response = await apiClient.post<DigitalAccount>('/digital-accounts', validatedData);
    return DigitalAccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar conta digital:', error);
    throw new Error('Falha ao criar conta digital');
  }
};

export const updateDigitalAccount = async (
  id: string,
  data: Partial<CreateDigitalAccount>,
): Promise<DigitalAccount> => {
  try {
    const validatedData = CreateDigitalAccountSchema.partial().parse(data);
    const response = await apiClient.put<DigitalAccount>(`/digital-accounts/${id}`, validatedData);
    return DigitalAccountSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar conta digital:', error);
    throw new Error('Falha ao atualizar conta digital');
  }
};

export const deleteDigitalAccount = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/digital-accounts/${id}`);
  } catch (error) {
    console.error('Erro ao deletar conta digital:', error);
    throw new Error('Falha ao deletar conta digital');
  }
};

export const getDigitalAccountBalance = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.get<{ balance: number }>(`/digital-accounts/${id}/balance`);
    return response.data.balance;
  } catch (error) {
    console.error('Erro ao buscar saldo da conta digital:', error);
    throw new Error('Falha ao buscar saldo da conta digital');
  }
};
