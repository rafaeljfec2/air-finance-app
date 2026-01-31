import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/apiClient';
import { authUtils } from '@/utils/auth';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Email Pending Page
 *
 * This screen appears when user tries to access the application
 * but their email is not yet verified.
 *
 * Rule: This screen always appears until email is verified.
 */
export function EmailPendingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refetchUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (user?.emailVerified === true) {
    if (user.onboardingCompleted === true) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setIsResending(true);
    setResendSuccess(null);
    setResendError(null);

    try {
      await apiClient.post('/auth/resend-confirmation', { email: user.email });
      setResendSuccess(
        'E-mail de verificação reenviado com sucesso! Verifique sua caixa de entrada.',
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erro ao reenviar e-mail. Tente novamente.';
      setResendError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckEmail = async () => {
    // Refetch user data to check if email was verified
    await refetchUser();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors - we'll clear local state anyway
    }
    authUtils.clearAuth();
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.removeQueries({ queryKey: ['companies'] });
    localStorage.removeItem('company-storage');
    localStorage.removeItem('@air-finance:company');
    navigate('/login', { replace: true });
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo */}
            <Logo className="w-16 h-16" />

            {/* Icon */}
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 w-20 h-20 flex items-center justify-center">
              <Mail className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-2">
                Verifique seu E-mail
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 text-sm">
                Enviamos um link de confirmação para{' '}
                <strong className="text-text dark:text-text-dark">{user.email}</strong>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 w-full">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Próximos passos:</strong>
              </p>
              <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside text-left">
                <li>Verifique sua caixa de entrada</li>
                <li>Clique no link de confirmação</li>
                <li>Volte aqui e clique em &quot;Verificar Email&quot;</li>
              </ol>
            </div>

            {/* Success/Error Messages */}
            {resendSuccess && (
              <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md w-full">
                {resendSuccess}
              </div>
            )}

            {resendError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md w-full">
                {resendError}
              </div>
            )}

            {/* Actions */}
            <div className="w-full space-y-3 pt-2">
              <Button
                onClick={handleCheckEmail}
                className="w-full bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white"
              >
                Verificar Email
              </Button>

              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Reenviar E-mail
                  </>
                )}
              </Button>

              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="ghost"
                className="w-full text-text/60 dark:text-text-dark/60 hover:text-text dark:hover:text-text-dark"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saindo...
                  </>
                ) : (
                  'Fazer Logout'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
