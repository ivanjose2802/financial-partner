'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useDashboard } from '@/hooks/useDashboard'
import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { FinancialHealth } from '@/components/dashboard/financial-health'
import { UpcomingTransactions } from '@/components/dashboard/upcoming-transactions'
import TransactionForm from '@/app/(dashboard)/transactions/TransactionForm'

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-muted rounded-xl mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-72 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError } = useDashboard()
  const [formOpen, setFormOpen] = useState(false)

  if (isLoading) return <DashboardSkeleton />

  if (isError || !data) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Failed to load dashboard. Please refresh the page.
      </div>
    )
  }

  return (
    <>
      <WelcomeHeader
        userName={user?.name ?? user?.email ?? 'there'}
        currentMonth={data.currentMonth}
        onAddTransaction={() => setFormOpen(true)}
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

      <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-6">
          <CashFlowChart data={data.cashFlowData} />
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <div className="grid gap-6 grid-rows-[1fr_auto]">
          <FinancialHealth className="h-full" />
          <UpcomingTransactions transactions={data.upcomingTransactions} />
        </div>
      </div>

      {formOpen && <TransactionForm onClose={() => setFormOpen(false)} />}
    </>
  )
}
