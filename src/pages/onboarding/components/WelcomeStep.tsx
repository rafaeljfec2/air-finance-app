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
  onNext: () => void;
}

export function WelcomeStep({ onNext }: Readonly<WelcomeStepProps>) {
  return (
    <motion.div
      key="step-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="text-center px-4 sm:px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-brand-leaf/20 rounded-full flex items-center justify-center mb-4 sm:mb-6"
        >
          <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-brand-leaf" />
        </motion.div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-text-dark mb-2 sm:mb-3 px-2">
          Bem-vindo ao AirFinance!
        </CardTitle>
        <CardDescription className="text-base sm:text-lg mt-2 text-text-dark/80 max-w-md mx-auto px-2">
          Vamos configurar sua conta em apenas 2 minutos.
          <br className="hidden sm:block" />
          <span className="block sm:inline">
            Tudo que você precisa para ter controle total das suas finanças.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="p-4 sm:p-6 rounded-lg border border-brand-leaf/20 bg-brand-arrow/10 flex flex-col items-center text-center transition-shadow hover:shadow-lg hover:shadow-brand-leaf/20 cursor-default"
          >
            <Target className="h-8 w-8 sm:h-10 sm:w-10 text-brand-leaf mb-2 sm:mb-3" />
            <h3 className="font-semibold text-brand-leaf text-base sm:text-lg mb-1 sm:mb-2">
              Organização
            </h3>
            <p className="text-xs sm:text-sm text-text-dark/80">
              Centralize suas empresas e contas em um só lugar.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="p-4 sm:p-6 rounded-lg border border-brand-leaf/20 bg-brand-leaf/10 flex flex-col items-center text-center transition-shadow hover:shadow-lg hover:shadow-brand-leaf/20 cursor-default"
          >
            <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-brand-leaf mb-2 sm:mb-3" />
            <h3 className="font-semibold text-brand-leaf text-base sm:text-lg mb-1 sm:mb-2">
              Crescimento
            </h3>
            <p className="text-xs sm:text-sm text-text-dark/80">
              Acompanhe métricas e tome decisões inteligentes.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border border-brand-leaf/30 bg-brand-leaf/5"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-leaf mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-text-dark/80">
              <p className="font-medium text-text-dark mb-1">Processo rápido e seguro</p>
              <p>Configure sua empresa, contas e categorias em poucos passos</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-center pb-4 sm:pb-8 px-4 sm:px-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={onNext}
            className="w-full sm:w-auto px-8 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
          >
            Começar Agora
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </CardFooter>
    </motion.div>
  );
}
