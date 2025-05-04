export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  companyId: string;
  createdAt: string;
  updatedAt: string;
};
