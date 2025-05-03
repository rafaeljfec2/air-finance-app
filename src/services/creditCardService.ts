import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const CreditCardSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  number: z.string().min(16).max(19),
  holderName: z.string().min(3),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
  cvv: z.string().min(3).max(4),
  limit: z.number(),
  availableLimit: z.number(),
  closingDay: z.number().min(1).max(31),
  dueDay: z.number().min(1).max(31),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCreditCardSchema = CreditCardSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  availableLimit: true,
});

export type CreditCard = z.infer<typeof CreditCardSchema>;
export type CreateCreditCard = z.infer<typeof CreateCreditCardSchema>;

// Service functions
export const getCreditCards = async (): Promise<CreditCard[]> => {
  try {
    const response = await apiClient.get<CreditCard[]>('/credit-cards');
    return CreditCardSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar cartões de crédito:', error);
    throw new Error('Falha ao buscar cartões de crédito');
  }
};

export const getCreditCardById = async (id: string): Promise<CreditCard> => {
  try {
    const response = await apiClient.get<CreditCard>(`/credit-cards/${id}`);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar cartão de crédito:', error);
    throw new Error('Falha ao buscar cartão de crédito');
  }
};

export const createCreditCard = async (data: CreateCreditCard): Promise<CreditCard> => {
  try {
    const validatedData = CreateCreditCardSchema.parse(data);
    const response = await apiClient.post<CreditCard>('/credit-cards', validatedData);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar cartão de crédito:', error);
    throw new Error('Falha ao criar cartão de crédito');
  }
};

export const updateCreditCard = async (
  id: string,
  data: Partial<CreateCreditCard>,
): Promise<CreditCard> => {
  try {
    const validatedData = CreateCreditCardSchema.partial().parse(data);
    const response = await apiClient.put<CreditCard>(`/credit-cards/${id}`, validatedData);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar cartão de crédito:', error);
    throw new Error('Falha ao atualizar cartão de crédito');
  }
};

export const deleteCreditCard = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/credit-cards/${id}`);
  } catch (error) {
    console.error('Erro ao deletar cartão de crédito:', error);
    throw new Error('Falha ao deletar cartão de crédito');
  }
};

export const getCreditCardStatement = async (
  id: string,
  month: number,
  year: number,
): Promise<{
  totalSpent: number;
  availableLimit: number;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
}> => {
  try {
    const response = await apiClient.get(`/credit-cards/${id}/statement`, {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fatura do cartão:', error);
    throw new Error('Falha ao buscar fatura do cartão');
  }
};
