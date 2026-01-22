import { useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { parseApiError, getUserFriendlyMessage } from '@/utils/apiErrorHandler';

interface UseEmailVerificationReturn {
  isResending: boolean;
  resendSuccess: string | null;
  resendError: string | null;
  handleResendEmail: (email: string) => Promise<void>;
  clearMessages: () => void;
}

export function useEmailVerification(): UseEmailVerificationReturn {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendEmail = async (email: string) => {
    setIsResending(true);
    setResendSuccess(null);
    setResendError(null);
    try {
      await apiClient.post('/auth/resend-confirmation', { email });
      setResendSuccess(
        'E-mail de verificação reenviado com sucesso! Verifique sua caixa de entrada.',
      );
    } catch (err: unknown) {
      const apiError = parseApiError(err);
      const friendlyMessage = getUserFriendlyMessage(apiError);
      setResendError(friendlyMessage);
    } finally {
      setIsResending(false);
    }
  };

  const clearMessages = () => {
    setResendSuccess(null);
    setResendError(null);
  };

  return {
    isResending,
    resendSuccess,
    resendError,
    handleResendEmail,
    clearMessages,
  };
}
