import { z } from 'zod';
import { apiClient } from './apiClient';

export const BankSchema = z.object({
  code: z.string().min(1, 'Código obrigatório'),
  ispb: z.string().min(1, 'ISPB obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  shortName: z.string().min(2, 'Nome curto obrigatório'),
  type: z.enum([
    'banco',
    'cooperativa',
    'instituicao_pagamento',
    'financeira',
    'scd',
    'sep',
  ]),
  pixDirect: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const CreateBankSchema = BankSchema;

export type Bank = z.infer<typeof BankSchema>;
export type CreateBank = z.infer<typeof CreateBankSchema>;

export const getBanks = async (): Promise<Bank[]> => {
  try {
    const response = await apiClient.get<Bank[]>('/bank');
    console.log('Resposta da API de bancos:', response.data);
    const parsed = BankSchema.array().parse(response.data);
    console.log('Bancos parseados:', parsed);
    return parsed;
  } catch (error) {
    console.error('Erro ao buscar bancos:', error);
    if (error instanceof Error) {
      console.error('Mensagem do erro:', error.message);
    }
    throw error;
  }
};

export const getBankByCode = async (code: string): Promise<Bank> => {
  try {
    const response = await apiClient.get<Bank>(`/bank/${code}`);
    return BankSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar banco:', error);
    throw new Error('Falha ao buscar banco' + error);
  }
};

export const createBank = async (data: CreateBank): Promise<Bank> => {
  try {
    const validatedData = CreateBankSchema.parse(data);
    const response = await apiClient.post<Bank>('/bank', validatedData);
    return BankSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar banco:', error);
    throw new Error('Falha ao criar banco' + error);
  }
};

export const updateBank = async (code: string, data: Partial<CreateBank>): Promise<Bank> => {
  try {
    const validatedData = CreateBankSchema.partial().parse(data);
    const response = await apiClient.put<Bank>(`/bank/${code}`, validatedData);
    return BankSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar banco:', error);
    throw new Error('Falha ao atualizar banco' + error);
  }
};

export const deleteBank = async (code: string): Promise<void> => {
  try {
    await apiClient.delete(`/bank/${code}`);
  } catch (error) {
    console.error('Erro ao deletar banco:', error);
    throw new Error('Falha ao deletar banco' + error);
  }
};
