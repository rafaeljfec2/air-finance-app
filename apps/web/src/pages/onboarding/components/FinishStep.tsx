import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Loader2, PartyPopper } from 'lucide-react';

interface FinishStepProps {
  onComplete: () => void;
  onBack: () => void;
  summary: {
    companyName: string;
    accountName: string;
    creditCardName: string;
    categoriesCount: number;
  };
  loading: boolean;
}

export function FinishStep({ onComplete, onBack, summary, loading }: Readonly<FinishStepProps>) {
  return (
    <motion.div
      key="step-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="text-center px-4 sm:px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <PartyPopper className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
        </motion.div>
        <CardTitle className="text-text dark:text-text-dark text-xl sm:text-2xl">Tudo Pronto!</CardTitle>
        <CardDescription className="text-text/70 dark:text-text-dark/70 text-base sm:text-lg">
          Configuramos seu ambiente com sucesso.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="bg-card dark:bg-card-dark/50 p-4 sm:p-6 rounded-lg border border-border dark:border-border-dark space-y-3 sm:space-y-4">
          <h4 className="font-semibold text-text dark:text-text-dark mb-4 border-b border-border dark:border-border-dark pb-2">
            Resumo da Configuração
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-text dark:text-text-dark">
                Empresa <strong>{summary.companyName}</strong> criada
              </span>
            </div>
            {summary.accountName && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-text dark:text-text-dark">
                  Conta <strong>{summary.accountName}</strong> configurada
                </span>
              </div>
            )}
            {summary.creditCardName && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-text dark:text-text-dark">
                  Cartão <strong>{summary.creditCardName}</strong> configurado
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-text dark:text-text-dark">
                <strong>{summary.categoriesCount}</strong> categorias adicionadas
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
        <Button
          variant="ghost"
          type="button"
          onClick={onBack}
          className="text-text dark:text-text-dark hover:bg-border-dark w-full sm:w-auto order-2 sm:order-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto order-1 sm:order-2"
        >
          <Button
            size="lg"
            onClick={onComplete}
            disabled={loading}
            className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 shadow-xl w-full sm:w-auto"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ir para o Dashboard
          </Button>
        </motion.div>
      </CardFooter>
    </motion.div>
  );
}
