// TODO: replace mock with useQuery(() => dashboardApi.getSummary()) once API endpoint exists

export interface DashboardTransaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
  isRecurring?: boolean
}

export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  currentBalance: number
  projectedBalance: number
  incomeTrend: number
  expenseTrend: number
}

export interface CashFlowPoint {
  month: string
  income: number
  expenses: number
}

export interface DashboardData {
  currentMonth: string
  summary: DashboardSummary
  recentTransactions: DashboardTransaction[]
  upcomingTransactions: DashboardTransaction[]
  cashFlowData: CashFlowPoint[]
}

const mockData: DashboardData = {
  currentMonth: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
  summary: {
    totalIncome: 8500,
    totalExpenses: 5200,
    currentBalance: 12450,
    projectedBalance: 15750,
    incomeTrend: 12,
    expenseTrend: -5,
  },
  upcomingTransactions: [
    { id: '1', description: 'Monthly Salary', amount: 6500, type: 'income', date: '2026-05-25', category: 'Salary', isRecurring: true },
    { id: '2', description: 'Rent Payment', amount: 1800, type: 'expense', date: '2026-05-28', category: 'Housing / Rent', isRecurring: true },
    { id: '3', description: 'Internet Bill', amount: 79, type: 'expense', date: '2026-05-30', category: 'Utilities', isRecurring: true },
    { id: '4', description: 'Netflix', amount: 15, type: 'expense', date: '2026-05-31', category: 'Entertainment', isRecurring: true },
  ],
  recentTransactions: [
    { id: 'r1', description: 'Grocery Store', amount: 156, type: 'expense', date: '2026-05-17', category: 'Food / Groceries' },
    { id: 'r2', description: 'Freelance Project', amount: 2000, type: 'income', date: '2026-05-15', category: 'Freelance' },
    { id: 'r3', description: 'Gas Station', amount: 65, type: 'expense', date: '2026-05-14', category: 'Transportation' },
    { id: 'r4', description: 'Restaurant Dinner', amount: 78, type: 'expense', date: '2026-05-12', category: 'Restaurants' },
    { id: 'r5', description: 'Electric Bill', amount: 120, type: 'expense', date: '2026-05-10', category: 'Utilities' },
  ],
  cashFlowData: [
    { month: 'Jan', income: 7500, expenses: 5800 },
    { month: 'Feb', income: 7500, expenses: 6200 },
    { month: 'Mar', income: 8200, expenses: 5500 },
    { month: 'Apr', income: 8000, expenses: 5900 },
    { month: 'May', income: 8500, expenses: 5200 },
  ],
}

export function useDashboard() {
  return { data: mockData, isLoading: false }
}
