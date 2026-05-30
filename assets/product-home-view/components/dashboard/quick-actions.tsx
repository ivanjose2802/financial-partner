"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  FileText, 
  PieChart, 
  Settings,
  Zap
} from "lucide-react"

const actions = [
  {
    icon: Plus,
    label: "Add Income",
    description: "Record a new income",
    variant: "default" as const,
  },
  {
    icon: FileText,
    label: "Add Expense",
    description: "Log an expense",
    variant: "outline" as const,
  },
  {
    icon: PieChart,
    label: "View Reports",
    description: "See detailed analytics",
    variant: "outline" as const,
  },
  {
    icon: Settings,
    label: "Manage Categories",
    description: "Customize categories",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Zap className="h-5 w-5 text-muted-foreground" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto flex-col gap-2 py-4"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
