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

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0, // Always fetch fresh data to avoid stale permissions/flags
    gcTime: 10 * 60 * 1000, 
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
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      authUtils.setToken(data.token);
      if (data.refreshToken) {
        authUtils.setRefreshToken(data.refreshToken);
      }
      authUtils.setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
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
  };
};
