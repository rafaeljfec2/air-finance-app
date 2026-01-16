import { useQuery } from '@tanstack/react-query';
import { getUserById, type User } from '../services/userService';

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
