export type TransactionType = 'income' | 'expense';
export type Recurrence = 'one_time' | 'recurring';
export type TransactionStatus = 'completed' | 'scheduled';
export type ExpenseCategory =
  | 'housing'
  | 'utilities'
  | 'services'
  | 'transportation'
  | 'food'
  | 'restaurants'
  | 'entertainment'
  | 'health'
  | 'insurance'
  | 'family_support'
  | 'education'
  | 'debt_payments'
  | 'subscriptions'
  | 'savings'
  | 'other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'housing',
  'utilities',
  'services',
  'transportation',
  'food',
  'restaurants',
  'entertainment',
  'health',
  'insurance',
  'family_support',
  'education',
  'debt_payments',
  'subscriptions',
  'savings',
  'other',
];

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  recurrence: Recurrence;
  status: TransactionStatus;
  amount: number;
  description: string;
  category?: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
