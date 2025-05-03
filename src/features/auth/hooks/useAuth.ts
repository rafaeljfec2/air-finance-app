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
  AuthError,
} from '../types/auth.types';
import { useEffect, useState } from 'react';

const REFRESH_TOKEN_INTERVAL = 5 * 60 * 1000; // 5 minutos em milissegundos

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setToken, clearAuth, token, refreshToken } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.accessToken, data.refreshToken);
    queryClient.setQueryData(['currentUser'], data.user);
    navigate('/dashboard');
  };

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: async (data: LoginData) => {
      if (authService.isAccountLocked(data.email)) {
        const remainingTime = authService.getRemainingLockoutTime(data.email);
        throw new Error(
          `Conta bloqueada. Tente novamente em ${Math.ceil(remainingTime / 60000)} minutos.`,
        );
      }

      try {
        const response = await authService.login(data);
        authService.resetLoginAttempts(data.email);
        return response;
      } catch (error) {
        authService.incrementLoginAttempts(data.email);
        throw error;
      }
    },
    onSuccess: handleAuthSuccess,
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: authService.register,
    onSuccess: handleAuthSuccess,
  });

  const refreshTokenMutation = useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      setToken(data.accessToken, data.refreshToken);
    },
    onError: () => {
      clearAuth();
      navigate('/login');
    },
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

  useEffect(() => {
    if (!token || !refreshToken) return;

    const refreshTokenInterval = setInterval(async () => {
      if (isRefreshing) return;

      try {
        setIsRefreshing(true);
        await refreshTokenMutation.mutateAsync(refreshToken);
      } catch (error) {
        console.error('Erro ao atualizar token:', error);
      } finally {
        setIsRefreshing(false);
      }
    }, REFRESH_TOKEN_INTERVAL);

    return () => clearInterval(refreshTokenInterval);
  }, [token, refreshToken, isRefreshing]);

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
    isAuthenticated: !!token,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as AuthError,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error as AuthError,
    requestPasswordRecovery: passwordRecoveryMutation.mutate,
    isRequestingPasswordRecovery: passwordRecoveryMutation.isPending,
    passwordRecoveryError: passwordRecoveryMutation.error as AuthError,
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error as AuthError,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error as AuthError,
    resendVerificationEmail: resendVerificationEmailMutation.mutate,
    isResendingVerificationEmail: resendVerificationEmailMutation.isPending,
    resendVerificationEmailError: resendVerificationEmailMutation.error as AuthError,
    logout,
  };
}
