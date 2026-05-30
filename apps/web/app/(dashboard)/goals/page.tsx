'use client'

import { useState } from 'react'
import { Target, Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/useGoals'
import { EXPENSE_CATEGORIES, type ExpenseCategory, type GoalWithProgress } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const CATEGORY_LABEL: Record<string, string> = {
  housing: 'Housing', utilities: 'Utilities', services: 'Services',
  transportation: 'Transportation', food: 'Food', restaurants: 'Restaurants',
  entertainment: 'Entertainment', health: 'Health', insurance: 'Insurance',
  family_support: 'Family', education: 'Education', debt_payments: 'Debt',
  subscriptions: 'Subscriptions', savings: 'Savings', other: 'Other',
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

// ─── Goal Form ────────────────────────────────────────────────────────────────

interface GoalFormProps {
  initial?: { categories: ExpenseCategory[]; limitAmount: number }
  onSubmit: (data: { categories: ExpenseCategory[]; limitAmount: number }) => void
  onCancel: () => void
  loading?: boolean
}

function GoalForm({ initial, onSubmit, onCancel, loading }: GoalFormProps) {
  const [categories, setCategories] = useState<ExpenseCategory[]>(initial?.categories ?? [])
  const [limitAmount, setLimitAmount] = useState(initial?.limitAmount?.toString() ?? '')
  const [error, setError] = useState('')

  const toggle = (cat: ExpenseCategory) =>
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (categories.length === 0) { setError('Select at least one category.'); return }
    const amt = parseFloat(limitAmount)
    if (!amt || amt <= 0) { setError('Enter a valid amount greater than 0.'); return }
    onSubmit({ categories, limitAmount: amt })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Categories</p>
        <div className="flex flex-wrap gap-1.5">
          {EXPENSE_CATEGORIES.map((cat) => {
            const selected = categories.includes(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggle(cat)}
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all border',
                  selected
                    ? cn(CATEGORY_STYLES[cat], 'border-current ring-2 ring-offset-1 ring-current/30')
                    : 'bg-muted text-muted-foreground border-transparent hover:bg-accent',
                )}
              >
                {selected && <Check className="h-3 w-3 mr-1" />}
                {CATEGORY_LABEL[cat]}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Spending limit</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Saving…' : 'Save goal'}
        </Button>
      </div>
    </form>
  )
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal }: { goal: GoalWithProgress }) {
  const [editing, setEditing] = useState(false)
  const update = useUpdateGoal()
  const del = useDeleteGoal()
  const pct = goal.percentageUsed
  const over = pct > 100

  if (editing) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="pt-4">
          <GoalForm
            initial={{ categories: goal.categories as ExpenseCategory[], limitAmount: goal.limitAmount }}
            onSubmit={(data) => update.mutate({ id: goal.id, body: data }, { onSuccess: () => setEditing(false) })}
            onCancel={() => setEditing(false)}
            loading={update.isPending}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {goal.categories.map((cat) => (
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
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => del.mutate(goal.id)}
              disabled={del.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={cn('text-sm font-semibold tabular-nums', over ? 'text-destructive' : 'text-foreground')}>
              {formatCurrency(goal.spentAmount)}
              <span className="text-muted-foreground font-normal text-xs ml-1">of {formatCurrency(goal.limitAmount)} limit</span>
            </span>
            <span className={cn('text-xs tabular-nums font-medium', over ? 'text-destructive' : pct >= 70 ? 'text-amber-500' : 'text-muted-foreground')}>
              {pct}%{over ? ' — over budget' : ''}
            </span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all', indicatorColor(pct))}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {over
              ? `${formatCurrency(goal.spentAmount - goal.limitAmount)} over limit`
              : `${formatCurrency(goal.limitAmount - goal.spentAmount)} remaining`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: goals, isLoading } = useGoals()
  const create = useCreateGoal()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-muted-foreground" />
            Spending Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set monthly spending limits by category and track your progress.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New goal
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">New spending goal</CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <GoalForm
              onSubmit={(data) =>
                create.mutate(data, { onSuccess: () => setShowForm(false) })
              }
              onCancel={() => setShowForm(false)}
              loading={create.isPending}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : goals?.length === 0 ? (
        <div className="py-20 text-center">
          <Target className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No spending goals for this month.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowForm(true)}>
            Create your first goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals!.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
