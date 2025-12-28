import { useAuthStore } from '@/stores/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  login,
  LoginData,
  logout,
  register,
  requestPasswordRecovery,
  resetPassword,
  User,
} from '../services/authService';
import { authUtils } from '../utils/auth';

export interface LoginOptions {
  rememberMe?: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  // Só busca o usuário se houver um token armazenado
  const hasToken = !!authUtils.getToken();

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0, // Always fetch fresh data to avoid stale permissions/flags
    gcTime: 10 * 60 * 1000,
    enabled: hasToken, // Só executa se houver token
  });

  const loginMutation = useMutation({
    mutationFn: async (variables: LoginOptions & LoginData) => {
      const { rememberMe, ...loginData } = variables;
      const data = await login(loginData);
      authUtils.setToken(data.token, !!rememberMe);
      if (data.refreshToken) {
        authUtils.setRefreshToken(data.refreshToken, !!rememberMe);
      }
      authUtils.setUser(data.user, !!rememberMe);
      queryClient.setQueryData(['user'], data.user);
      setUser(data.user);
      setToken(data.token);
      // Invalidate companies query to refetch after login
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    // Não faz login automático após registro
    // Usuário precisa confirmar o email antes de poder fazer login
    onSuccess: async () => {
      // Não salva token nem user - usuário precisa confirmar email primeiro
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      authUtils.clearAuth();
      queryClient.removeQueries({ queryKey: ['user'] });
      navigate('/');
    },
  });

  const passwordRecoveryMutation = useMutation({
    mutationFn: requestPasswordRecovery,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  });

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    requestPasswordRecovery: passwordRecoveryMutation.mutate,
    resetPassword: resetPasswordMutation,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRecoveringPassword: passwordRecoveryMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    refetchUser: refetch,
  };
};
