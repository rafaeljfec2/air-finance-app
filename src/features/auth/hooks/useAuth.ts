import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth';
import {
  LoginData,
  RegisterData,
  PasswordRecoveryData,
  ResetPasswordData,
} from '../types/auth.types';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setToken, clearAuth } = useAuthStore();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
      queryClient.setQueryData(['currentUser'], user);
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
      queryClient.setQueryData(['currentUser'], user);
      navigate('/dashboard');
    },
  });

  const passwordRecoveryMutation = useMutation({
    mutationFn: authService.requestPasswordRecovery,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ data, token }: { data: ResetPasswordData; token: string }) =>
      authService.resetPassword(data, token),
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
    logout,
  };
}
