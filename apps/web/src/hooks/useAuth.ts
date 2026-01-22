import { useAuthStore } from '@/stores/auth';
import { useCompanyStore } from '@/stores/company';
import { useCompanyStore as useCompanyContext } from '@/contexts/companyContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LoginData,
  User,
  getCurrentUser,
  login,
  logout,
  register,
  requestPasswordRecovery,
  resetPassword,
} from '../services/authService';
import { authUtils } from '../utils/auth';

export interface LoginOptions {
  rememberMe?: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  // Sempre tenta buscar o usuário, pois cookies HttpOnly são enviados automaticamente
  // Com cookies HttpOnly, não há token no localStorage, mas os cookies são enviados automaticamente
  // Se não houver autenticação, a API retornará erro e o React Query tratará
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
    error: userError,
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0, // Always fetch fresh data to avoid stale permissions/flags
    gcTime: 10 * 60 * 1000,
    enabled: true, // Sempre tenta buscar, pois cookies HttpOnly são enviados automaticamente
  });

  // Sincronizar user do React Query com o Zustand store quando disponível
  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (userError) {
      // Se houver erro (ex: 401), limpa o estado de autenticação
      setUser(null);
      setToken(null);
    }
  }, [user, userError, setUser, setToken]);

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
      // Clear authentication
      authUtils.clearAuth();
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['companies'] });
      setUser(null);
      setToken(null);
      
      // SECURITY FIX: Clear ALL company stores to prevent data leaks between users
      // Clear old company store (if still in use)
      useCompanyStore.getState().clearActiveCompany();
      
      // Clear company context store
      useCompanyContext.getState().setCompanyId('');
      useCompanyContext.getState().setCompanies([]);
      
      // Fallback: Manually remove from localStorage to ensure complete cleanup
      localStorage.removeItem('company-storage');
      localStorage.removeItem('@air-finance:company');
      
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
