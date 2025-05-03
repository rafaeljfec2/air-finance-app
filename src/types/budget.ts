export interface CashFlow {
  month: string; // '2024-05'
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  finalBalance: number;
}

export interface Receivable {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'PENDING' | 'RECEIVED';
}

export interface Payable {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'PENDING' | 'PAID';
}

export interface CreditCardBill {
  id: string;
  cardId: string;
  month: string;
  total: number;
  dueDate: string;
  status: 'OPEN' | 'CLOSED' | 'PAID';
  transactions: Array<{
    id: string;
    description: string;
    value: number;
    date: string;
    category: string;
  }>;
}

export interface CreditCard {
  id: string;
  name: string;
  brand: 'nubank' | 'itau';
  limit: number;
  bills: CreditCardBill[];
}
