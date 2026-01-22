import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Mail, Send } from 'lucide-react';

interface EmailVerificationCardProps {
  email: string;
  isResending: boolean;
  resendSuccess: string | null;
  resendError: string | null;
  onResendEmail: () => void;
  onBackToLogin: () => void;
}

export function EmailVerificationCard({
  email,
  isResending,
  resendSuccess,
  resendError,
  onResendEmail,
  onBackToLogin,
}: Readonly<EmailVerificationCardProps>) {
  return (
    <div className="p-6 space-y-6 text-center">
      <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 w-16 h-16 mx-auto flex items-center justify-center mb-4">
        <Mail className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
      </div>
      <h2 className="text-xl font-semibold text-text dark:text-text-dark">
        Verifique seu E-mail
      </h2>
      <p className="text-sm text-text/80 dark:text-text-dark/80">
        Sua conta ainda não foi ativada. Enviamos um link de confirmação para{' '}
        <strong>{email}</strong>. Caso você não receba o e-mail, clique no botão abaixo para
        reenviar.
      </p>

      {resendSuccess && (
        <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md">
          {resendSuccess}
        </div>
      )}
      {resendError && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
          {resendError}
        </div>
      )}

      <div className="space-y-3 pt-4">
        <Button
          onClick={onResendEmail}
          disabled={isResending}
          className={cn(
            'w-full h-11 bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white transition-colors gap-2',
          )}
        >
          {isResending ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Reenviar E-mail
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onBackToLogin} className="w-full h-11">
          Voltar para Login
        </Button>
      </div>
    </div>
  );
}
