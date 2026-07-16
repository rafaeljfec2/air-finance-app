import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';

interface LoginLayoutProps {
  readonly cardContent: ReactNode;
  readonly footer?: ReactNode;
}

export function LoginLayout({ cardContent, footer }: LoginLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-arrow/10 blur-3xl filter dark:bg-brand-leaf/10" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-brand-arrow/10 blur-3xl filter dark:bg-brand-leaf/10" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="px-4 pt-6 sm:px-8 sm:pt-8">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-text/60 transition-colors hover:bg-accent hover:text-brand-arrow dark:text-text-dark/60 dark:hover:text-brand-leaf"
            >
              <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
              <span>Voltar para o início</span>
            </Link>
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Logo showSlogan className="mx-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border bg-card/50 backdrop-blur-sm dark:border-border-dark dark:bg-card-dark/50">
                {cardContent}
              </Card>
            </motion.div>

            {footer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {footer}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
