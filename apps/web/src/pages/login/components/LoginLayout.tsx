import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LoginLayoutProps {
  cardContent: ReactNode;
  footer?: ReactNode;
}

export function LoginLayout({ cardContent, footer }: Readonly<LoginLayoutProps>) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-arrow/10 dark:bg-brand-leaf/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-arrow/10 dark:bg-brand-leaf/10 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Botão Voltar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-10"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-text/60 hover:text-brand-arrow dark:text-text-dark/60 dark:hover:text-brand-leaf transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Voltar para o início</span>
        </Button>
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Título */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Logo showSlogan className="mx-auto" />
          </motion.div>

          {/* Card de Login ou Confirmação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm">
              {cardContent}
            </Card>
          </motion.div>

          {/* Footer */}
          {footer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {footer}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
