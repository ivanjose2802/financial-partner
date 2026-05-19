import { useQuery } from '@tanstack/react-query'
import { dashboardApi, type Transaction } from '@/lib/api-client'

export interface DashboardTransaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
  isRecurring?: boolean
}

function currentMonthString(): string {
  return new Date().toISOString().slice(0, 7)
}

function mapTransaction(t: Transaction): DashboardTransaction {
  return {
    id: t.id,
    description: t.description,
    amount: Number(t.amount),
    type: t.type as 'income' | 'expense',
    date: t.date,
    category: t.category ?? (t.type === 'income' ? 'income' : 'other'),
    isRecurring: t.recurrence === 'recurring',
  }
}

export function useDashboard() {
  const month = currentMonthString()

  const query = useQuery({
    queryKey: ['dashboard', 'summary', month],
    queryFn: () => dashboardApi.getSummary(month),
    staleTime: 60_000,
  })

  const data = query.data
    ? {
        currentMonth: query.data.currentMonth,
        summary: {
          ...query.data.summary,
          incomeTrend: query.data.summary.incomeTrend ?? undefined,
          expenseTrend: query.data.summary.expenseTrend ?? undefined,
        },
        recentTransactions: query.data.recentTransactions.map(mapTransaction),
        upcomingTransactions: query.data.upcomingTransactions.map(mapTransaction),
        cashFlowData: query.data.cashFlowData,
      }
    : undefined

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
