'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { transactionsApi, type Transaction } from '@/lib/api-client';
import TransactionForm from './TransactionForm';

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatAmount(t: Transaction) {
  const sign = t.type === 'income' ? '+' : '-';
  return `${sign}$${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function formatDate(date: string) {
  return new Date(date.slice(0, 10) + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function TransactionsPage() {
  const [month, setMonth] = useState(currentMonth);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', month],
    queryFn: () => transactionsApi.list({ month }),
  });

  const transactions = data?.data ?? [];

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(t: Transaction) {
    setEditing(t);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  return (
    <>
      {/* Header — stacks vertically on mobile */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">{data?.total ?? 0} transactions</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative shrink-0 w-40">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-lg border border-border bg-background text-foreground pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
            />
          </div>
          <button
            onClick={openCreate}
            className="hidden sm:flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            + Add transaction
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No transactions for this month</p>
          <p className="text-sm mt-1">Click &quot;Add transaction&quot; to add one</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl ring-1 ring-border overflow-hidden">
          {transactions.map((t, i) => (
            <button
              key={t.id}
              onClick={() => openEdit(t)}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent transition-colors ${
                i !== 0 ? 'border-t border-border/50' : ''
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  t.type === 'income' ? 'bg-chart-1' : 'bg-chart-2'
                }`}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {t.category
                    ? t.category.replace(/_/g, ' ')
                    : t.type === 'income'
                    ? 'Income'
                    : '—'}
                </p>
              </div>

              {t.recurrence === 'recurring' && (
                <span className="hidden sm:inline flex-shrink-0 text-xs text-chart-3">recurring</span>
              )}

              <span
                className={`flex-shrink-0 text-sm font-semibold tabular-nums ${
                  t.type === 'income' ? 'text-chart-1' : 'text-chart-2'
                }`}
              >
                {formatAmount(t)}
              </span>

              <span className="flex-shrink-0 text-xs text-muted-foreground w-12 text-right">
                {formatDate(t.date)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* FAB — mobile only */}
      <button
        onClick={openCreate}
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        <Plus className="h-5 w-5" />
        Add
      </button>

      {formOpen && <TransactionForm transaction={editing} onClose={closeForm} />}
    </>
  );
}
