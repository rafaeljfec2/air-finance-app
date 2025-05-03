import { useState } from 'react';

export type Account = {
  id: string;
  name: string;
  type: string;
  initialBalance: string;
  color: string;
  icon: string;
  companyId: string;
};

const MOCKED_ACCOUNTS: Account[] = [];

export function useAccounts(companyId?: string) {
  const [accounts, setAccounts] = useState<Account[]>(MOCKED_ACCOUNTS);
  const [loading, setLoading] = useState(false);

  // Simular fetch do backend
  const fetchAccounts = async () => {
    setLoading(true);
    // Aqui entraria a chamada real de API futuramente
    await new Promise((res) => setTimeout(res, 300));
    setLoading(false);
  };

  const addAccount = async (account: Omit<Account, 'id'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    setAccounts((prev) => [...prev, { ...account, id: Date.now().toString() }]);
    setLoading(false);
  };

  const updateAccount = async (id: string, account: Omit<Account, 'id'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...account, id } : a)));
    setLoading(false);
  };

  const deleteAccount = async (id: string) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setLoading(false);
  };

  // Filtrar contas pela empresa ativa, se fornecida
  const filteredAccounts = companyId ? accounts.filter((a) => a.companyId === companyId) : accounts;

  return {
    accounts: filteredAccounts,
    loading,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
}
