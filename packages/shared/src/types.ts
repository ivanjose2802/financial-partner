export type TransactionType = 'income' | 'expense';
export type Recurrence = 'one_time' | 'recurring';
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

export interface CashFlowPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  projectedBalance: number;
  scheduledExpenses: number;
  scheduledIncome: number;
  incomeTrend: number | null;
  expenseTrend: number | null;
}

export interface DashboardResponse {
  currentMonth: string;
  summary: DashboardSummary;
  recentTransactions: Transaction[];
  upcomingTransactions: Transaction[];
  cashFlowData: CashFlowPoint[];
}

export interface Goal {
  id: string;
  userId: string;
  categories: ExpenseCategory[];
  limitAmount: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalWithProgress extends Goal {
  spentAmount: number;
  percentageUsed: number;
}
