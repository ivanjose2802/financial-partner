"use client"

import { Button } from "@/components/ui/button"
import { Plus, Bell } from "lucide-react"

interface WelcomeHeaderProps {
  userName: string
  currentMonth: string
  onAddTransaction: () => void
}

export function WelcomeHeader({ userName, currentMonth, onAddTransaction }: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your financial overview for <span className="font-medium text-foreground">{currentMonth}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-chart-2" />
        </Button>
        <Button className="gap-2" onClick={onAddTransaction}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </div>
  )
}
