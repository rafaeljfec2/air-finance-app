import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth';
import {
  LoginData,
  RegisterData,
  PasswordRecoveryData,
  ResetPasswordData,
  VerifyEmailData,
  AuthResponse,
  User,
} from '../types/auth.types';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateAuthState, clearAuth } = useAuthStore();

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleAuthSuccess = (data: AuthResponse) => {
    updateAuthState(data.user, data.token);
    queryClient.setQueryData(['currentUser'], data.user);
    navigate('/dashboard');
  };

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: authService.login,
    onSuccess: handleAuthSuccess,
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: authService.register,
    onSuccess: handleAuthSuccess,
  });

  const passwordRecoveryMutation = useMutation<void, Error, PasswordRecoveryData>({
    mutationFn: authService.requestPasswordRecovery,
    onSuccess: () => {
      navigate('/login?recovery=success');
    },
  });

  const resetPasswordMutation = useMutation<
    void,
    Error,
    { data: ResetPasswordData; token: string }
  >({
    mutationFn: ({ data, token }) => authService.resetPassword(data, token),
    onSuccess: () => {
      navigate('/login?reset=success');
    },
  });

  const verifyEmailMutation = useMutation<void, Error, VerifyEmailData>({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/dashboard?email=verified');
    },
  });

  const resendVerificationEmailMutation = useMutation<void, Error, string>({
    mutationFn: authService.resendVerificationEmail,
  });

  const logout = async () => {
    try {
      await authService.logout();
      clearAuth();
      queryClient.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
    login: (data: LoginData) => loginMutation.mutate(data),
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: (data: RegisterData) => registerMutation.mutate(data),
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    requestPasswordRecovery: (data: PasswordRecoveryData) => passwordRecoveryMutation.mutate(data),
    isRequestingPasswordRecovery: passwordRecoveryMutation.isPending,
    passwordRecoveryError: passwordRecoveryMutation.error,
    resetPassword: (data: ResetPasswordData, token: string) =>
      resetPasswordMutation.mutate({ data, token }),
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
    verifyEmail: (data: VerifyEmailData) => verifyEmailMutation.mutate(data),
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,
    resendVerificationEmail: (email: string) => resendVerificationEmailMutation.mutate(email),
    isResendingVerificationEmail: resendVerificationEmailMutation.isPending,
    resendVerificationEmailError: resendVerificationEmailMutation.error,
    logout,
  };
}
