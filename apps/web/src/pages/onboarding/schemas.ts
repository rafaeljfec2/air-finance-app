import { z } from 'zod';

export const CompanySchema = z.object({
  name: z.string().min(3, 'Nome da empresa deve ter pelo menos 3 caracteres'),
  type: z.enum(['matriz', 'filial']).default('matriz'),
});

export const AccountSchema = z.object({
  name: z.string().min(3, 'Nome da conta deve ter pelo menos 3 caracteres'),
  type: z
    .enum(['checking', 'savings', 'investment', 'digital_wallet'])
    .default('checking'),
  initialBalance: z.coerce.number().default(0),
  institution: z.string().min(2, 'Informe a instituição'),
  bankCode: z.string().optional(),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional().default('#8A05BE'),
  icon: z.string().min(1, 'Ícone é obrigatório').optional().default('Banknote'),
  initialBalanceDate: z.string().optional(),
});

export const CreditCardSchema = z.object({
  name: z.string().min(3, 'Nome do cartão deve ter pelo menos 3 caracteres'),
  limit: z.coerce.number().min(0.01, 'Limite deve ser maior que zero'),
  closingDay: z.coerce.number().min(1, 'Dia de fechamento inválido').max(31, 'Dia de fechamento inválido'),
  dueDay: z.coerce.number().min(1, 'Dia de vencimento inválido').max(31, 'Dia de vencimento inválido'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional().default('#8A05BE'),
  icon: z.string().min(1, 'Ícone é obrigatório').optional().default('CreditCard'),
  bankCode: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
});

export const GoalSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    description: z.string().optional(),
    targetAmount: z.number().min(0.01, 'Valor alvo deve ser maior que zero'),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data limite inválida'),
    accountId: z.string().optional(), // Will be set on complete
    categoryId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadlineDate >= today;
      }
      return true;
    },
    {
      message: 'Data limite não pode ser no passado',
      path: ['deadline'],
    },
  );

export const RecurringTransactionSchema = z
  .object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    value: z.number().min(0.01, 'Valor deve ser maior que zero'),
    type: z.enum(['Income', 'Expense']),
    category: z.string().min(1, 'Categoria é obrigatória'),
    accountId: z.string().optional(), // Will be set on complete
    startDate: z.string().min(1, 'Data inicial é obrigatória'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    repeatUntil: z.string().min(1, 'Data final é obrigatória'),
  })
  .refine(
    (data) => {
      if (data.repeatUntil && data.startDate) {
        return new Date(data.repeatUntil) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'Data final deve ser posterior à data inicial',
      path: ['repeatUntil'],
    },
  );

export type CompanyFormData = z.infer<typeof CompanySchema>;
export type AccountFormData = z.infer<typeof AccountSchema>;
export type CreditCardFormData = z.infer<typeof CreditCardSchema>;
export type CategoryFormData = z.infer<typeof CategorySchema>;
export type GoalFormData = z.infer<typeof GoalSchema>;
export type RecurringTransactionFormData = z.infer<typeof RecurringTransactionSchema>;
