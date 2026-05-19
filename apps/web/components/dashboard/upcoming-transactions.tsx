"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  date: string
  category: string
  isRecurring?: boolean
}

interface UpcomingTransactionsProps {
  transactions: Transaction[]
}

export function UpcomingTransactions({ transactions }: UpcomingTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays <= 7) return `In ${diffDays} days`
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          Upcoming Transactions
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          {transactions.length} scheduled
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming transactions
          </p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-1.5 ${
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                    {transaction.isRecurring && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Recurring
                      </Badge>
                    )}
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
          ))
        )}
      </CardContent>
    </Card>
  )
}
