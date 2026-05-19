"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  ChevronRight
} from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  date: string
  category: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const CATEGORY_STYLES: Record<string, string> = {
  housing:        'bg-amber-100 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900/30',
  utilities:      'bg-cyan-100 text-cyan-700 border-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-900/30',
  services:       'bg-slate-100 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-800',
  transportation: 'bg-blue-100 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/30',
  food:           'bg-green-100 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900/30',
  restaurants:    'bg-red-100 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/30',
  entertainment:  'bg-purple-100 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900/30',
  health:         'bg-rose-100 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-900/30',
  insurance:      'bg-indigo-100 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-900/30',
  family_support: 'bg-pink-100 text-pink-700 border-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-900/30',
  education:      'bg-sky-100 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-900/30',
  debt_payments:  'bg-orange-100 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-900/30',
  subscriptions:  'bg-violet-100 text-violet-700 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-900/30',
  savings:        'bg-emerald-100 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/30',
  other:          'bg-gray-100 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800',
  income:         'bg-teal-100 text-teal-700 border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-900/30',
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr.slice(0, 10) + 'T12:00:00').toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Receipt className="h-5 w-5 text-muted-foreground" />
          Recent Transactions
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
          <Link href="/transactions">
            View All
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${
                    transaction.type === "income"
                      ? "bg-chart-1/10 text-chart-1"
                      : "bg-chart-2/10 text-chart-2"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                    <span>·</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      CATEGORY_STYLES[transaction.category] ?? (transaction.type === 'income' ? CATEGORY_STYLES.income : CATEGORY_STYLES.other)
                    }`}>
                      {transaction.category
                        ? transaction.category.replace(/_/g, ' ')
                        : transaction.type === 'income' ? 'Income' : '—'}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  transaction.type === "income" ? "text-chart-1" : "text-chart-2"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
