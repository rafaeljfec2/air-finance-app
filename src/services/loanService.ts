import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const LoanSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.enum(['personal', 'mortgage', 'car', 'student', 'business']),
  amount: z.number(),
  interestRate: z.number(),
  term: z.number(), // in months
  monthlyPayment: z.number(),
  institution: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateLoanSchema = LoanSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  monthlyPayment: true,
  endDate: true,
});

export type Loan = z.infer<typeof LoanSchema>;
export type CreateLoan = z.infer<typeof CreateLoanSchema>;

// Service functions
export const getLoans = async (): Promise<Loan[]> => {
  try {
    const response = await apiClient.get<Loan[]>('/loans');
    return LoanSchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar empréstimos:', error);
    throw new Error('Falha ao buscar empréstimos');
  }
};

export const getLoanById = async (id: string): Promise<Loan> => {
  try {
    const response = await apiClient.get<Loan>(`/loans/${id}`);
    return LoanSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar empréstimo:', error);
    throw new Error('Falha ao buscar empréstimo');
  }
};

export const createLoan = async (data: CreateLoan): Promise<Loan> => {
  try {
    const validatedData = CreateLoanSchema.parse(data);
    const response = await apiClient.post<Loan>('/loans', validatedData);
    return LoanSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error);
    throw new Error('Falha ao criar empréstimo');
  }
};

export const updateLoan = async (id: string, data: Partial<CreateLoan>): Promise<Loan> => {
  try {
    const validatedData = CreateLoanSchema.partial().parse(data);
    const response = await apiClient.put<Loan>(`/loans/${id}`, validatedData);
    return LoanSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error);
    throw new Error('Falha ao atualizar empréstimo');
  }
};

export const deleteLoan = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/loans/${id}`);
  } catch (error) {
    console.error('Erro ao deletar empréstimo:', error);
    throw new Error('Falha ao deletar empréstimo');
  }
};

export const getLoanAmortization = async (
  id: string,
): Promise<{
  totalInterest: number;
  totalPayment: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}> => {
  try {
    const response = await apiClient.get(`/loans/${id}/amortization`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar amortização do empréstimo:', error);
    throw new Error('Falha ao buscar amortização do empréstimo');
  }
};
