import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type RecurringTransactionFormData, RecurringTransactionSchema } from '../schemas';

interface RecurringStepProps {
  onNext: (data: RecurringTransactionFormData | null) => void;
  onBack: () => void;
  accountName?: string;
}

export function RecurringStep({ onNext, onBack, accountName }: Readonly<RecurringStepProps>) {
  const recurringTransactionForm = useForm<RecurringTransactionFormData>({
    resolver: zodResolver(RecurringTransactionSchema),
    defaultValues: {
      type: 'Expense',
      frequency: 'monthly',
      value: 0,
      startDate: formatDateToLocalISO(new Date()),
      repeatUntil: formatDateToLocalISO(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      ),
      category: '',
      description: '',
    },
  });

  const [recurringTransactionValueInput, setRecurringTransactionValueInput] = useState('');

  return (
    <motion.div
      key="step-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={recurringTransactionForm.handleSubmit((data) => onNext(data))}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text-dark text-xl sm:text-2xl">
            Transações Recorrentes
          </CardTitle>
          <CardDescription className="text-text-dark/70 text-sm sm:text-base">
            Configure transações que se repetem automaticamente. Você pode pular esta etapa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="recurringDescription" className="text-text-dark">
              Descrição
            </Label>
            <Input
              id="recurringDescription"
              placeholder="Ex: Aluguel, Internet, Salário..."
              className="bg-card-dark border-border-dark text-text-dark"
              {...recurringTransactionForm.register('description')}
            />
            {recurringTransactionForm.formState.errors.description && (
              <p className="text-sm text-red-400">
                {String(recurringTransactionForm.formState.errors.description.message)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurringType" className="text-text-dark">
                Tipo
              </Label>
              <Select
                value={recurringTransactionForm.watch('type')}
                onValueChange={(value) =>
                  recurringTransactionForm.setValue('type', value as 'Income' | 'Expense')
                }
              >
                <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                  <SelectItem
                    value="Income"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    Receita
                  </SelectItem>
                  <SelectItem
                    value="Expense"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    Despesa
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurringValue" className="text-text-dark">
                Valor
              </Label>
              <Input
                id="recurringValue"
                type="text"
                placeholder="R$ 0,00"
                value={recurringTransactionValueInput}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  setRecurringTransactionValueInput(formatted);
                  recurringTransactionForm.setValue('value', parseCurrency(formatted));
                }}
                className="bg-card-dark border-border-dark text-text-dark"
              />
              {recurringTransactionForm.formState.errors.value && (
                <p className="text-sm text-red-400">
                  {String(recurringTransactionForm.formState.errors.value.message)}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recurringCategory" className="text-text-dark">
              Categoria
            </Label>
            <Input
              id="recurringCategory"
              placeholder="Ex: Alimentação, Transporte..."
              className="bg-card-dark border-border-dark text-text-dark"
              {...recurringTransactionForm.register('category')}
            />
            <p className="text-xs text-text-dark/50">
              Nome da categoria (pode ser uma das categorias criadas anteriormente ou nova)
            </p>
            {recurringTransactionForm.formState.errors.category && (
              <p className="text-sm text-red-400">
                {String(recurringTransactionForm.formState.errors.category.message)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurringFrequency" className="text-text-dark">
                Frequência
              </Label>
              <Select
                value={recurringTransactionForm.watch('frequency')}
                onValueChange={(value) =>
                  recurringTransactionForm.setValue(
                    'frequency',
                    value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                  )
                }
              >
                <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                  <SelectItem
                    value="daily"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    Diária
                  </SelectItem>
                  <SelectItem
                    value="weekly"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    Semanal
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    Mensal
                  </SelectItem>
                  <SelectItem
                    value="yearly"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    Anual
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurringAccountId" className="text-text-dark">
                Conta
              </Label>
              <Input
                id="recurringAccountId"
                value={accountName || 'Será usada a conta criada anteriormente'}
                disabled
                className="bg-card-dark/50 border-border-dark text-text-dark/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurringStartDate" className="text-text-dark">
                Data Inicial
              </Label>
              <DatePicker
                value={recurringTransactionForm.watch('startDate') || undefined}
                onChange={(date) => {
                  const dateString = date ? formatDateToLocalISO(date) : '';
                  recurringTransactionForm.setValue('startDate', dateString);
                }}
                placeholder="Selecionar data inicial"
                className="bg-card-dark border-border-dark text-text-dark"
              />
              {recurringTransactionForm.formState.errors.startDate && (
                <p className="text-sm text-red-400">
                  {String(recurringTransactionForm.formState.errors.startDate.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurringRepeatUntil" className="text-text-dark">
                Data Final
              </Label>
              <DatePicker
                value={recurringTransactionForm.watch('repeatUntil') || undefined}
                onChange={(date) => {
                  const dateString = date ? formatDateToLocalISO(date) : '';
                  recurringTransactionForm.setValue('repeatUntil', dateString);
                }}
                placeholder="Selecionar data final"
                minDate={
                  recurringTransactionForm.watch('startDate')
                    ? parseLocalDate(recurringTransactionForm.watch('startDate'))
                    : undefined
                }
                className="bg-card-dark border-border-dark text-text-dark"
              />
              {recurringTransactionForm.formState.errors.repeatUntil && (
                <p className="text-sm text-red-400">
                  {String(recurringTransactionForm.formState.errors.repeatUntil.message)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            <Button
              variant="ghost"
              type="button"
              onClick={onBack}
              className="text-text-dark hover:bg-border-dark w-full sm:w-auto"
              aria-label="Voltar para etapa anterior"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="ghost"
                type="button"
                onClick={() => onNext(null)}
                className="text-text-dark hover:bg-border-dark w-full sm:w-auto"
                aria-label="Pular etapa de transações recorrentes"
              >
                Pular
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                type="submit"
                className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                aria-label="Continuar para próxima etapa"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </form>
    </motion.div>
  );
}
