import { useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  phone: string;
  permissions: string[];
  notes?: string;
  status: 'active' | 'inactive';
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = async (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = async (id: string, user: Omit<User, 'id'>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...user, id } : u)));
  };

  const deleteUser = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
};
