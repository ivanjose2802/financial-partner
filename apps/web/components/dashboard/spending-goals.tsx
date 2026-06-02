'use client'

import Link from 'next/link'
import { Target, ChevronRight, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGoals } from '@/hooks/useGoals'
import { cn } from '@/lib/utils'

const CATEGORY_LABEL: Record<string, string> = {
  housing: 'Housing',
  utilities: 'Utilities',
  services: 'Services',
  transportation: 'Transportation',
  food: 'Food',
  restaurants: 'Restaurants',
  entertainment: 'Entertainment',
  health: 'Health',
  insurance: 'Insurance',
  family_support: 'Family',
  education: 'Education',
  debt_payments: 'Debt',
  subscriptions: 'Subscriptions',
  savings: 'Savings',
  other: 'Other',
}

const CATEGORY_STYLES: Record<string, string> = {
  housing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  utilities: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  services: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  transportation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  food: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  restaurants: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
  entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  health: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  insurance: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  family_support: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  education: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  debt_payments: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  subscriptions: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  savings: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

function indicatorColor(pct: number): string {
  if (pct >= 90) return 'bg-destructive'
  if (pct >= 70) return 'bg-amber-500'
  return 'bg-chart-1'
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

export function SpendingGoals() {
  const { data: goals, isLoading } = useGoals()

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-1.5 w-full bg-muted rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const visible = (goals ?? []).slice(0, 3)
  const hasMore = (goals?.length ?? 0) > 3

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
          <Target className="h-4 w-4" />
          Spending Goals
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
          <Link href="/goals">
            {visible.length === 0 ? (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </>
            ) : (
              <>
                Manage
                <ChevronRight className="ml-1 h-3 w-3" />
              </>
            )}
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {visible.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">No goals set for this month.</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/goals">Set a spending goal</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((goal) => {
              const pct = goal.percentageUsed
              const over = pct > 100

              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1 min-w-0">
                      {goal.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                            CATEGORY_STYLES[cat] ?? CATEGORY_STYLES.other,
                          )}
                        >
                          {CATEGORY_LABEL[cat] ?? cat}
                        </span>
                      ))}
                      {goal.categories.length > 2 && (
                        <span className="text-[11px] text-muted-foreground self-center">
                          +{goal.categories.length - 2}
                        </span>
                      )}
                    </div>
                    <span className={cn('text-xs tabular-nums whitespace-nowrap shrink-0', over ? 'text-destructive font-semibold' : 'text-muted-foreground')}>
                      {formatCurrency(goal.spentAmount)} / {formatCurrency(goal.limitAmount)}
                    </span>
                  </div>

                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full transition-all', indicatorColor(pct))}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-end">
                    <span className={cn('text-[11px] tabular-nums', over ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                      {over ? `${pct}% — over budget` : `${pct}%`}
                    </span>
                  </div>
                </div>
              )
            })}

            {hasMore && (
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" asChild>
                <Link href="/goals">
                  View all {goals!.length} goals
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
