import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type CompanyFormData, CompanySchema } from '../schemas';

interface CompanyStepProps {
  onNext: (data: CompanyFormData) => void;
  onBack: () => void;
  loading: boolean;
  initialData?: CompanyFormData | null;
}

export function CompanyStep({ onNext, onBack, loading, initialData }: Readonly<CompanyStepProps>) {
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(CompanySchema),
    defaultValues: initialData || {
      type: 'matriz',
    },
  });

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      companyForm.reset(initialData);
    }
  }, [initialData, companyForm]);

  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={companyForm.handleSubmit(onNext)}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text dark:text-text dark:text-text-dark text-xl sm:text-2xl">
            Crie sua Cadastro
          </CardTitle>
          <CardDescription className="text-text/70 dark:text-text dark:text-text-dark/70 text-sm sm:text-base">
            Seu cadastro é a base para organizar suas finanças. Você poderá adicionar outros
            cadastros depois.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-text dark:text-text-dark">
              Nome
            </Label>
            <Input
              id="companyName"
              placeholder="Ex: Minha Loja Ltda, MEI João..."
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
              aria-label="Nome do Perfil"
              {...companyForm.register('name')}
            />
            {companyForm.formState.errors.name && (
              <p className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" />
                {String(companyForm.formState.errors.name.message)}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            variant="ghost"
            type="button"
            onClick={onBack}
            className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 w-full sm:w-auto order-1 sm:order-2"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuar
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </motion.div>
  );
}
