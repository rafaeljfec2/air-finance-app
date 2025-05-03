import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login,
  register,
  logout,
  getCurrentUser,
  requestPasswordRecovery,
  User,
} from '../services/authService';
import { authUtils } from '../utils/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await authUtils.setToken(data.token);
      if (data.refreshToken) {
        await authUtils.setRefreshToken(data.refreshToken);
      }
      await authUtils.setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      await authUtils.setToken(data.token);
      if (data.refreshToken) {
        await authUtils.setRefreshToken(data.refreshToken);
      }
      await authUtils.setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await authUtils.clearAuth();
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  const passwordRecoveryMutation = useMutation({
    mutationFn: requestPasswordRecovery,
  });

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    requestPasswordRecovery: passwordRecoveryMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRecoveringPassword: passwordRecoveryMutation.isPending,
  };
};
