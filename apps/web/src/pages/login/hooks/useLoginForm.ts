import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { parseApiError, getUserFriendlyMessage } from '@/utils/apiErrorHandler';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UseLoginFormReturn {
  formData: LoginFormData;
  error: string | null;
  isLoggingIn: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent, onEmailNotVerified: () => void) => void;
  setError: (error: string | null) => void;
}

export function useLoginForm(): UseLoginFormReturn {
  const { login, isLoggingIn } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent, onEmailNotVerified: () => void) => {
    e.preventDefault();
    setError(null);

    login(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onError: (err: unknown) => {
          const apiError = parseApiError(err);
          const friendlyMessage = getUserFriendlyMessage(apiError);
          const backendMessage = (apiError.message ?? '').toLowerCase();
          const lowerFriendlyMessage = friendlyMessage.toLowerCase();

          const isEmailNotVerified =
            apiError.status === 403 &&
            (backendMessage.includes('não verificado') ||
              backendMessage.includes('verifique seu e-mail') ||
              backendMessage.includes('verifique seu email') ||
              lowerFriendlyMessage.includes('não verificado') ||
              lowerFriendlyMessage.includes('verifique seu e-mail') ||
              lowerFriendlyMessage.includes('verifique seu email'));

          if (isEmailNotVerified) {
            onEmailNotVerified();
            return;
          }

          setError(friendlyMessage);
        },
      },
    );
  };

  return {
    formData,
    error,
    isLoggingIn,
    handleChange,
    handleSubmit,
    setError,
  };
}
