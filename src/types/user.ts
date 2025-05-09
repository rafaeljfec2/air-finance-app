export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  companyIds: string[];
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    updates: boolean;
    marketing: boolean;
    security: boolean;
  };
  preferences?: {
    currency: 'BRL' | 'USD' | 'EUR';
    language: 'pt-BR' | 'en-US' | 'es-ES';
    theme: 'light' | 'dark' | 'system';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  };
  createdAt: string;
  updatedAt: string;
};
