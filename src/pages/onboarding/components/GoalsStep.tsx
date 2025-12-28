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
import { formatDateToLocalISO } from '@/utils/date';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type GoalFormData, GoalSchema } from '../schemas';

interface GoalsStepProps {
  onNext: (data: GoalFormData | null) => void;
  onBack: () => void;
  accountName?: string;
  initialData?: GoalFormData | null;
}

export function GoalsStep({
  onNext,
  onBack,
  accountName,
  initialData,
}: Readonly<GoalsStepProps>) {
  const goalForm = useForm<GoalFormData>({
    resolver: zodResolver(GoalSchema),
    defaultValues: initialData || {
      targetAmount: 0,
    },
  });

  const [goalTargetAmountInput, setGoalTargetAmountInput] = useState('');

  // Initialize form and local state when initialData changes
  useEffect(() => {
    if (initialData) {
      goalForm.reset(initialData);
      if (initialData.targetAmount) {
        setGoalTargetAmountInput(formatCurrencyInput(String(initialData.targetAmount)));
      }
    }
  }, [initialData, goalForm]);

  return (
    <motion.div
      key="step-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={goalForm.handleSubmit((data) => onNext(data))}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text dark:text-text-dark text-xl sm:text-2xl">Metas</CardTitle>
          <CardDescription className="text-text dark:text-text-dark/70 text-sm sm:text-base">
            Defina uma meta financeira para acompanhar seu progresso. Você pode pular esta etapa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="goalName" className="text-text dark:text-text-dark">
              Nome da Meta
            </Label>
            <Input
              id="goalName"
              placeholder="Ex: Reserva de emergência, Viagem..."
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
              {...goalForm.register('name')}
            />
            {goalForm.formState.errors.name && (
              <p className="text-sm text-red-400">
                {String(goalForm.formState.errors.name.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalDescription" className="text-text dark:text-text-dark">
              Descrição (Opcional)
            </Label>
            <Input
              id="goalDescription"
              placeholder="Descreva sua meta..."
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
              {...goalForm.register('description')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalTargetAmount" className="text-text dark:text-text-dark">
              Valor Alvo
            </Label>
            <Input
              id="goalTargetAmount"
              type="text"
              placeholder="R$ 0,00"
              value={goalTargetAmountInput}
              onChange={(e) => {
                const formatted = formatCurrencyInput(e.target.value);
                setGoalTargetAmountInput(formatted);
                goalForm.setValue('targetAmount', parseCurrency(formatted));
              }}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
              aria-label="Valor alvo da meta"
            />
            {goalForm.formState.errors.targetAmount && (
              <p className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" />
                {String(goalForm.formState.errors.targetAmount.message)}
              </p>
            )}
            <p className="text-xs text-text dark:text-text-dark/60">
              Valor que você deseja alcançar com esta meta
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalDeadline" className="text-text dark:text-text-dark">
              Data Limite
            </Label>
            <DatePicker
              value={goalForm.watch('deadline') || undefined}
              onChange={(date) => {
                const dateString = date ? formatDateToLocalISO(date) : '';
                goalForm.setValue('deadline', dateString);
              }}
              placeholder="Selecionar data limite"
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
              aria-label="Data limite da meta"
            />
            {goalForm.formState.errors.deadline && (
              <p className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" />
                {String(goalForm.formState.errors.deadline.message)}
              </p>
            )}
            <p className="text-xs text-text dark:text-text-dark/60">
              Selecione uma data futura para o prazo da sua meta
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalAccountId" className="text-text dark:text-text-dark">
              Conta
            </Label>
            <Input
              id="goalAccountId"
              value={accountName || 'Será usada a conta criada anteriormente'}
              disabled
              className="bg-card dark:bg-card-dark/50 border-border dark:border-border-dark text-text dark:text-text-dark/50"
            />
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
              className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark w-full sm:w-auto"
              aria-label="Voltar para etapa anterior"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => onNext(null)}
              className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark w-full sm:w-auto"
            >
              Pular
            </Button>
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
