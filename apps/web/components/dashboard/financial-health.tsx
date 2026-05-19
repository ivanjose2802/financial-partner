"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock } from "lucide-react"

export function FinancialHealth({ className }: { className?: string }) {
  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur-sm flex flex-col ${className ?? ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Shield className="h-5 w-5 text-muted-foreground" />
          Financial Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center py-8 space-y-4">
        <div className="rounded-full bg-muted/50 p-3">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Unlock detailed financial insights
        </p>
        <Button className="w-full">
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  )
}
