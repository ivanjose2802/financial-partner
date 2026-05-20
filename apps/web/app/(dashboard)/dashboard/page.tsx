'use client'

import { useState } from 'react'
import { Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useDashboard } from '@/hooks/useDashboard'
import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { FinancialHealth } from '@/components/dashboard/financial-health'
import { UpcomingTransactions } from '@/components/dashboard/upcoming-transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
          title="Safe to Spend"
          amount={data.summary.projectedBalance}
          icon="wallet"
          variant="default"
          subtitle="After pending transactions"
        />
        <BalanceCard
          title="Current Balance"
          amount={data.summary.currentBalance}
          icon="wallet"
          variant="default"
        />
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Income This Month
            </CardTitle>
            <div className="rounded-lg p-2 bg-chart-1/10">
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-chart-1">
                +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.summary.totalIncome)}
              </span>
              <span className="text-xs text-muted-foreground">received</span>
            </div>
            {data.summary.scheduledIncome > 0 && (
              <div className="flex items-baseline gap-1.5 opacity-60">
                <span className="text-base font-medium text-chart-1">
                  +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.summary.scheduledIncome)}
                </span>
                <span className="text-xs text-muted-foreground">incoming</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Expenses This Month
            </CardTitle>
            <div className="rounded-lg p-2 bg-chart-2/10">
              <TrendingDown className="h-4 w-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-chart-2">
                -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.summary.totalExpenses)}
              </span>
              <span className="text-xs text-muted-foreground">paid</span>
            </div>
            {data.summary.scheduledExpenses > 0 && (
              <div className="flex items-baseline gap-1.5 opacity-60">
                <span className="text-base font-medium text-chart-2">
                  -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.summary.scheduledExpenses)}
                </span>
                <span className="text-xs text-muted-foreground">committed</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-6">
          <CashFlowChart data={data.cashFlowData} className="h-96" />
          <div className="lg:hidden">
            <UpcomingTransactions transactions={data.upcomingTransactions} scheduledExpenses={data.summary.scheduledExpenses} />
          </div>
          <div className="lg:hidden">
            <FinancialHealth />
          </div>
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <div className="grid gap-6 grid-rows-[1fr_auto]">
          <FinancialHealth className="h-96 hidden lg:flex" />
          <div className="hidden lg:block">
            <UpcomingTransactions transactions={data.upcomingTransactions} scheduledExpenses={data.summary.scheduledExpenses} />
          </div>
        </div>
      </div>

      {/* FAB — mobile only */}
      <button
        onClick={() => setFormOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        <Plus className="h-5 w-5" />
        Add
      </button>

      {formOpen && <TransactionForm onClose={() => setFormOpen(false)} />}
    </>
  )
}
