import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { UpcomingTransactions } from "@/components/dashboard/upcoming-transactions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart"
import { FinancialHealth } from "@/components/dashboard/financial-health"

// Mock data - In a real app, this would come from your database
const mockData = {
  user: {
    name: "Alex",
  },
  currentMonth: "May 2026",
  summary: {
    totalIncome: 8500,
    totalExpenses: 5200,
    currentBalance: 12450,
    projectedBalance: 15750,
    incomeTrend: 12,
    expenseTrend: -5,
  },
  upcomingTransactions: [
    {
      id: "1",
      description: "Monthly Salary",
      amount: 6500,
      type: "income" as const,
      date: "2026-05-25",
      category: "Salary",
      isRecurring: true,
    },
    {
      id: "2",
      description: "Rent Payment",
      amount: 1800,
      type: "expense" as const,
      date: "2026-05-28",
      category: "Housing / Rent",
      isRecurring: true,
    },
    {
      id: "3",
      description: "Internet Bill",
      amount: 79,
      type: "expense" as const,
      date: "2026-05-30",
      category: "Utilities",
      isRecurring: true,
    },
    {
      id: "4",
      description: "Netflix Subscription",
      amount: 15,
      type: "expense" as const,
      date: "2026-05-31",
      category: "Entertainment",
      isRecurring: true,
    },
  ],
  recentTransactions: [
    {
      id: "r1",
      description: "Grocery Store",
      amount: 156,
      type: "expense" as const,
      date: "2026-05-17",
      category: "Food / Groceries",
    },
    {
      id: "r2",
      description: "Freelance Project",
      amount: 2000,
      type: "income" as const,
      date: "2026-05-15",
      category: "Freelance",
    },
    {
      id: "r3",
      description: "Gas Station",
      amount: 65,
      type: "expense" as const,
      date: "2026-05-14",
      category: "Transportation",
    },
    {
      id: "r4",
      description: "Restaurant Dinner",
      amount: 78,
      type: "expense" as const,
      date: "2026-05-12",
      category: "Entertainment",
    },
    {
      id: "r5",
      description: "Electric Bill",
      amount: 120,
      type: "expense" as const,
      date: "2026-05-10",
      category: "Utilities",
    },
  ],
  cashFlowData: [
    { month: "Jan", income: 7500, expenses: 5800 },
    { month: "Feb", income: 7500, expenses: 6200 },
    { month: "Mar", income: 8200, expenses: 5500 },
    { month: "Apr", income: 8000, expenses: 5900 },
    { month: "May", income: 8500, expenses: 5200 },
  ],
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <WelcomeHeader 
          userName={mockData.user.name} 
          currentMonth={mockData.currentMonth} 
        />

        {/* Summary Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BalanceCard
            title="Balance of the Month"
            amount={mockData.summary.currentBalance}
            icon="wallet"
            variant="default"
          />
          <BalanceCard
            title="Total Income"
            amount={mockData.summary.totalIncome}
            trend={mockData.summary.incomeTrend}
            icon="up"
            variant="income"
          />
          <BalanceCard
            title="Total Expenses"
            amount={mockData.summary.totalExpenses}
            trend={mockData.summary.expenseTrend}
            icon="down"
            variant="expense"
          />
          <BalanceCard
            title="Projected Balance"
            amount={mockData.summary.projectedBalance}
            icon="wallet"
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left Column - Chart */}
          <div className="lg:col-span-2 space-y-6">
            <CashFlowChart data={mockData.cashFlowData} />
            <RecentTransactions transactions={mockData.recentTransactions} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <FinancialHealth />
            <UpcomingTransactions transactions={mockData.upcomingTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
