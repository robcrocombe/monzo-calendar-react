declare namespace monzo {
  type Transactions = Dictionary<monzo.Transaction[]>;
  type PlannedTransactions = Dictionary<monzo.PlannedTransaction[]>;
  type TransactionType = 'debit' | 'credit';
  type Category =
    | 'general'
    | 'mondo'
    | 'eating_out'
    | 'expenses'
    | 'transport'
    | 'cash'
    | 'bills'
    | 'entertainment'
    | 'shopping'
    | 'holidays'
    | 'groceries'
    | 'personal_care'
    | 'family';

  interface InitResponse {
    transactions: monzo.Transaction[];
    balance: monzo.Balance;
  }

  interface AccountResponse {
    accounts: Account[];
  }

  interface TransactionsResponse {
    transactions: Transaction[];
  }

  interface Account {
    id: string;
    description: string;
    created: string;
  }

  interface Balance {
    balance: number;
    currency: string;
    spend_today: number;
    total_balance: number;
  }

  interface Transaction {
    amount?: number;
    category?: Category;
    created?: string;
    currency?: string;
    description?: string;
    id?: string;
    merchant?: string;
    notes?: string;
    settled?: string;
    updated?: string;
    debit?: boolean;
  }

  interface ActionCategory {
    value: Category;
    label: string;
  }

  interface PlannedTransaction {
    name: string;
    category: Category;
    amount: number;
    currency: string;
  }

  interface TransactionForm {
    name: string;
    category: Category;
    type: TransactionType;
    amount: number;
    dates: calendar.Date[];
  }
}
