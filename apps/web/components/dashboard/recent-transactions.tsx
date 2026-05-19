"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

const categoryColors: Record<string, string> = {
  "Housing / Rent": "bg-chart-3/20 text-chart-3",
  "Utilities": "bg-chart-4/20 text-chart-4",
  "Food / Groceries": "bg-chart-1/20 text-chart-1",
  "Entertainment": "bg-chart-5/20 text-chart-5",
  "Transportation": "bg-chart-2/20 text-chart-2",
  "Salary": "bg-chart-1/20 text-chart-1",
  "Freelance": "bg-primary/20 text-primary",
  "default": "bg-muted text-muted-foreground",
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
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] px-1.5 py-0 ${categoryColors[transaction.category] || categoryColors.default}`}
                    >
                      {transaction.category}
                    </Badge>
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
