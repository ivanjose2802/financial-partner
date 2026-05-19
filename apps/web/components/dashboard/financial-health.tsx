"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock } from "lucide-react"

const previewMetrics = [
  { label: 'Savings Rate', value: '23%' },
  { label: 'Debt-to-Income', value: '0.38' },
  { label: 'Emergency Fund', value: '3.2 mo' },
  { label: 'Net Worth Growth', value: '+8.4%' },
]

export function FinancialHealth({ className }: { className?: string }) {
  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur-sm flex flex-col ${className ?? ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Shield className="h-5 w-5 text-muted-foreground" />
          Financial Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center py-4 space-y-4">
        <div className="space-y-2 w-full">
          {previewMetrics.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-semibold blur-[3px] select-none pointer-events-none">
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 w-full pt-1">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            Unlock detailed financial insights
          </p>
          <Button className="w-full" size="sm">
            Upgrade to Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
