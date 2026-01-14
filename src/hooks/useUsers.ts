import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createUser,
    deleteAllUserData,
    deleteAllUserDataByEmail,
    deleteUser,
    getUsers,
    updateUser,
    type CreateUser,
    type User,
} from '../services/userService';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUser> }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user', id] });
    },
  });

  const deleteAllUserDataMutation = useMutation({
    mutationFn: deleteAllUserData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  const deleteAllUserDataByEmailMutation = useMutation({
    mutationFn: deleteAllUserDataByEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutate,
    deleteAllUserData: deleteAllUserDataMutation.mutate,
    deleteAllUserDataByEmail: deleteAllUserDataByEmailMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDeletingAllData: deleteAllUserDataMutation.isPending,
    isDeletingAllDataByEmail: deleteAllUserDataByEmailMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    deleteAllDataError: deleteAllUserDataMutation.error,
    deleteAllDataByEmailError: deleteAllUserDataByEmailMutation.error,
  };
};
