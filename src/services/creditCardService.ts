import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const CreditCardSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  number: z.string().min(16, 'Número do cartão inválido').max(19, 'Número do cartão inválido'),
  holderName: z.string().min(3, 'Nome do titular deve ter pelo menos 3 caracteres'),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Data de validade inválida'),
  cvv: z.string().min(3, 'CVV inválido').max(4, 'CVV inválido'),
  limit: z.number().min(0, 'Limite deve ser maior que zero'),
  availableLimit: z.number().min(0, 'Limite disponível inválido'),
  closingDay: z.number().min(1, 'Dia de fechamento inválido').max(31, 'Dia de fechamento inválido'),
  dueDay: z.number().min(1, 'Dia de vencimento inválido').max(31, 'Dia de vencimento inválido'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  userId: z.string(),
  companyId: z.string(),
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
