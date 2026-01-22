import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoginForm } from './hooks/useLoginForm';
import { useEmailVerification } from './hooks/useEmailVerification';
import { LoginLayout } from './components/LoginLayout';
import { EmailVerificationCard } from './components/EmailVerificationCard';
import { GoogleLoginButton } from './components/GoogleLoginButton';
import { FormSeparator } from './components/FormSeparator';
import { LoginForm } from './components/LoginForm';
import { LoginFooter } from './components/LoginFooter';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const {
    formData,
    error,
    isLoggingIn,
    handleChange,
    handleSubmit,
    setError,
  } = useLoginForm();

  const {
    isResending,
    resendSuccess,
    resendError,
    handleResendEmail,
    clearMessages,
  } = useEmailVerification();

  // Verifica erro na URL (vindo do callback OAuth)
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setError]);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname;
      const target = from && from !== '/dashboard' ? from : '/home';
      navigate(target);
    }
  }, [isAuthenticated, location.state?.from?.pathname, navigate]);

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, () => {
      setNeedsConfirmation(true);
      clearMessages();
    });
  };

  const handleResend = async () => {
    await handleResendEmail(formData.email);
  };

  const handleBackToLogin = () => {
    setNeedsConfirmation(false);
    clearMessages();
  };

  // Retorna null se já estiver autenticado (evita render desnecessário)
  if (isAuthenticated) {
    return null;
  }

  return (
    <LoginLayout
      cardContent={
        needsConfirmation ? (
          <EmailVerificationCard
            email={formData.email}
            isResending={isResending}
            resendSuccess={resendSuccess}
            resendError={resendError}
            onResendEmail={handleResend}
            onBackToLogin={handleBackToLogin}
          />
        ) : (
          <div className="p-6 space-y-6">
            <GoogleLoginButton />
            <FormSeparator />
            <LoginForm
              formData={formData}
              error={error}
              isLoggingIn={isLoggingIn}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onChange={handleChange}
              onSubmit={handleFormSubmit}
            />
          </div>
        )
      }
      footer={<LoginFooter />}
    />
  );
}
