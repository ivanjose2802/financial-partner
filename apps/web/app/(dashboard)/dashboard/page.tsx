'use client'

import { useAuth } from '@/lib/auth-context'
import { useDashboard } from '@/hooks/useDashboard'
import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { FinancialHealth } from '@/components/dashboard/financial-health'
import { UpcomingTransactions } from '@/components/dashboard/upcoming-transactions'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data } = useDashboard()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <WelcomeHeader
          userName={user?.name ?? user?.email ?? 'there'}
          currentMonth={data.currentMonth}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BalanceCard
            title="Balance of the Month"
            amount={data.summary.currentBalance}
            icon="wallet"
            variant="default"
          />
          <BalanceCard
            title="Total Income"
            amount={data.summary.totalIncome}
            trend={data.summary.incomeTrend}
            icon="up"
            variant="income"
          />
          <BalanceCard
            title="Total Expenses"
            amount={data.summary.totalExpenses}
            trend={data.summary.expenseTrend}
            icon="down"
            variant="expense"
          />
          <BalanceCard
            title="Projected Balance"
            amount={data.summary.projectedBalance}
            icon="wallet"
            variant="default"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CashFlowChart data={data.cashFlowData} />
            <RecentTransactions transactions={data.recentTransactions} />
          </div>
          <div className="space-y-6">
            <FinancialHealth />
            <UpcomingTransactions transactions={data.upcomingTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
