export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  category?: string;
  amount: number;
  date: string;
  comment?: string;
  userId: string;
}

export interface FetchTransactionsParams {
  page?: number;
  limit?: number;
  userId: string;
}

export interface DeleteTransactionParams {
  id: string;
  userId: string;
}

export interface AddTransactionParams {
  type: 'income' | 'expense';
  category?: string;
  amount: number;
  date: string;
  comment?: string;
  userId: string;
}

export interface EditTransactionParams {
  id: string;
  userId: string;
  updatedTransaction: {
    type: 'income' | 'expense';
    category?: string;
    amount: number;
    date: string;
    comment?: string;
  };
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  transactionId: string | null;
}