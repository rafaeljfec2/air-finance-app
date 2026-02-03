import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Sparkles, Target, TrendingUp } from 'lucide-react';

interface WelcomeStepProps {
  readonly onNext: () => void;
  readonly onSkip?: () => void;
}

export function WelcomeStep({ onNext, onSkip }: Readonly<WelcomeStepProps>) {
  return (
    <motion.div
      key="step-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="text-center px-4 sm:px-6 pb-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-brand-leaf/20 rounded-full flex items-center justify-center mb-2 sm:mb-3"
        >
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-brand-leaf" />
        </motion.div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-1 sm:mb-2 px-2">
          Bem-vindo ao AirFinance!
        </CardTitle>
        <CardDescription className="text-sm sm:text-base mt-1 text-text/80 dark:text-text-dark/80 max-w-md mx-auto px-2">
          Vamos configurar sua conta em apenas 2 minutos.
          <br className="hidden sm:block" />
          <span className="block sm:inline">
            Tudo que você precisa para ter controle total das suas finanças.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 sm:p-4 rounded-lg border border-brand-leaf/20 bg-brand-arrow/10 flex flex-col items-center text-center"
          >
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-brand-leaf mb-1.5 sm:mb-2" />
            <h3 className="font-semibold text-brand-leaf text-sm sm:text-base mb-1">Organização</h3>
            <p className="text-xs text-text/80 dark:text-text-dark/80">
              Centralize suas empresas e contas em um só lugar.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 sm:p-4 rounded-lg border border-brand-leaf/20 bg-brand-leaf/10 flex flex-col items-center text-center"
          >
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-brand-leaf mb-1.5 sm:mb-2" />
            <h3 className="font-semibold text-brand-leaf text-sm sm:text-base mb-1">Crescimento</h3>
            <p className="text-xs text-text/80 dark:text-text-dark/80">
              Acompanhe métricas e tome decisões inteligentes.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-lg border border-brand-leaf/30 bg-brand-leaf/5"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-leaf mt-0.5 flex-shrink-0" />
            <div className="text-xs text-text/80 dark:text-text-dark/80">
              <p className="font-medium text-text dark:text-text-dark mb-0.5">
                Processo rápido e seguro
              </p>
              <p>Configure seu perfil, contas e categorias em poucos passos</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center gap-3 pb-3 sm:pb-6 px-4 sm:px-6 pt-2">
        {onSkip ? (
          <>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="order-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onSkip}
                className="order-1 border border-border dark:border-border-dark bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200 hover:bg-primary-100 dark:hover:bg-primary-800/40 font-medium transition-colors"
              >
                Não fazer onboarding agora
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="order-2">
              <Button
                size="lg"
                onClick={onNext}
                className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
              >
                Começar Agora
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex justify-center"
          >
            <Button
              size="lg"
              onClick={onNext}
              className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
            >
              Começar Agora
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </motion.div>
        )}
      </CardFooter>
    </motion.div>
  );
}
