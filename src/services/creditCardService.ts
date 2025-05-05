import { apiClient } from './apiClient';
import { z } from 'zod';

// Validation schemas
export const CreditCardSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  limit: z.number().min(0, 'Limite deve ser maior que zero'),
  closingDay: z.number().min(1, 'Dia de fechamento inválido').max(31, 'Dia de fechamento inválido'),
  dueDay: z.number().min(1, 'Dia de vencimento inválido').max(31, 'Dia de vencimento inválido'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreditCard = z.infer<typeof CreditCardSchema>;
export type CreateCreditCardPayload = {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
  icon: string;
  companyId: string;
};

// Service functions
export const getCreditCards = async (companyId: string): Promise<CreditCard[]> => {
  try {
    const response = await apiClient.get<CreditCard[]>(`/companies/${companyId}/credit-cards`);
    return CreditCardSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar cartões de crédito:', error);
    throw new Error('Falha ao buscar cartões de crédito ' + error);
  }
};

export const getCreditCardById = async (companyId: string, id: string): Promise<CreditCard> => {
  try {
    const response = await apiClient.get<CreditCard>(`/companies/${companyId}/credit-cards/${id}`);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar cartão de crédito:', error);
    throw new Error('Falha ao buscar cartões de crédito ' + error);
  }
};

export const createCreditCard = async (
  companyId: string,
  data: CreateCreditCardPayload,
): Promise<CreditCard> => {
  try {
    const response = await apiClient.post<CreditCard>(`/companies/${companyId}/credit-cards`, data);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar cartão de crédito:', error);
    throw new Error('Falha ao criar cartão de crédito');
  }
};

export const updateCreditCard = async (
  companyId: string,
  id: string,
  data: Partial<CreateCreditCardPayload>,
): Promise<CreditCard> => {
  try {
    const validatedData = CreditCardSchema.partial().parse(data);
    const response = await apiClient.put<CreditCard>(
      `/companies/${companyId}/credit-cards/${id}`,
      validatedData,
    );
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar cartão de crédito:', error);
    throw new Error('Falha ao atualizar cartão de crédito');
  }
};

export const deleteCreditCard = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/credit-cards/${id}`);
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

export const updateCreditCardStatus = async (
  companyId: string,
  id: string,
  status: string,
): Promise<CreditCard> => {
  try {
    const response = await apiClient.patch<CreditCard>(
      `/companies/${companyId}/credit-cards/${id}/status`,
      { status },
    );
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar status do cartão:', error);
    throw new Error('Falha ao atualizar status do cartão');
  }
};
