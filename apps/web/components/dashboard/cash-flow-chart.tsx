"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface CashFlowData {
  month: string
  income: number
  expenses: number
}

interface CashFlowChartProps {
  data: CashFlowData[]
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.slice(-3)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`
    return `$${value}`
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          Monthly Cash Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full [&_svg]:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="25%"
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                strokeOpacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
                width={40}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.15 }}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "income" ? "Income" : "Expenses",
                ]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">
                    {value === "income" ? "Income" : "Expenses"}
                  </span>
                )}
              />
              <Bar
                dataKey="income"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
                maxBarSize={72}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
                maxBarSize={72}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
