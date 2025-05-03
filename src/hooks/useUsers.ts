import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useCompanyContext } from '@/contexts/companyContext';

export function useUsers() {
  const { companyId } = useCompanyContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    loadUsers();
  }, [companyId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Administrador',
          email: 'admin@empresa.com',
          role: 'admin',
          status: 'active',
          companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Usuário Teste',
          email: 'usuario@empresa.com',
          role: 'user',
          status: 'active',
          companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setUsers(mockUsers.filter((user) => user.companyId === companyId));
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError('Erro ao adicionar usuário');
      throw err;
    }
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...user, updatedAt: new Date().toISOString() } : u)),
      );
    } catch (err) {
      setError('Erro ao atualizar usuário');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError('Erro ao excluir usuário');
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    loadUsers,
  };
}
