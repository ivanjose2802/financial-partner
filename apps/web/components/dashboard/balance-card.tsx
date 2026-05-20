"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface BalanceCardProps {
  title: string
  amount: number
  trend?: number
  subtitle?: string
  icon?: "wallet" | "up" | "down"
  variant?: "default" | "income" | "expense"
}

export function BalanceCard({
  title,
  amount,
  trend,
  subtitle,
  icon = "wallet",
  variant = "default"
}: BalanceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const IconComponent = {
    wallet: Wallet,
    up: TrendingUp,
    down: TrendingDown,
  }[icon]

  const isNegative = variant === "default" && amount < 0

  const amountColor =
    variant === "income" ? "text-chart-1"
    : variant === "expense" ? "text-chart-2"
    : isNegative ? "text-red-600"
    : "text-foreground"

  const iconBgStyles = {
    default: isNegative ? "bg-red-50" : "bg-secondary",
    income: "bg-chart-1/10",
    expense: "bg-chart-2/10",
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`rounded-lg p-2 ${iconBgStyles[variant]}`}>
          <IconComponent className={`h-4 w-4 ${amountColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${amountColor}`}>
          {variant === "expense" ? "-" : ""}{formatCurrency(variant === "default" ? amount : Math.abs(amount))}
        </div>
        {subtitle && (
          <p className="mt-1 text-[11px] text-muted-foreground opacity-60">{subtitle}</p>
        )}
        {trend !== undefined && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3 text-chart-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-chart-2" />
            )}
            <span className={trend >= 0 ? "text-chart-1" : "text-chart-2"}>
              {Math.abs(trend)}%
            </span>
            <span>vs last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
