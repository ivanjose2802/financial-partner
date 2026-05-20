'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Calendar, Repeat, Receipt } from 'lucide-react';
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

function sectionTotals(txs: Transaction[]) {
  let inc = 0, exp = 0;
  for (const t of txs) {
    if (t.type === 'income') inc += Number(t.amount);
    else exp += Number(t.amount);
  }
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const net = inc - exp;
  return {
    income: fmt(inc),
    expenses: fmt(exp),
    net: (net >= 0 ? '+' : '-') + fmt(Math.abs(net)),
  };
}

const CATEGORY_STYLES: Record<string, string> = {
  housing:        'bg-amber-100 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900/30',
  utilities:      'bg-cyan-100 text-cyan-700 border-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-900/30',
  services:       'bg-slate-100 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-800',
  transportation: 'bg-blue-100 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/30',
  food:           'bg-green-100 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900/30',
  restaurants:    'bg-red-100 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/30',
  entertainment:  'bg-purple-100 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900/30',
  health:         'bg-rose-100 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-900/30',
  insurance:      'bg-indigo-100 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-900/30',
  family_support: 'bg-pink-100 text-pink-700 border-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-900/30',
  education:      'bg-sky-100 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-900/30',
  debt_payments:  'bg-orange-100 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-900/30',
  subscriptions:  'bg-violet-100 text-violet-700 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-900/30',
  savings:        'bg-emerald-100 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/30',
  other:          'bg-gray-100 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800',
  income:         'bg-teal-100 text-teal-700 border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-900/30',
};

export default function TransactionsPage() {
  const [month, setMonth] = useState(currentMonth);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', month],
    queryFn: () => transactionsApi.list({ month }),
  });

  const transactions = data?.data ?? [];

  const recurring = [...transactions.filter(t => t.recurrence === 'recurring')]
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'income' ? -1 : 1;
      return b.amount - a.amount;
    });
  const oneTime = transactions.filter(t => t.recurrence === 'one_time');
  const recurringTotals = sectionTotals(recurring);
  const oneTimeTotals = sectionTotals(oneTime);

  function renderRow(t: Transaction, i: number) {
    return (
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
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5" style={{ fontSize: 11 }}>
            {formatDate(t.date)}
            <span>·</span>
            {t.category || t.type === 'income' ? (
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                CATEGORY_STYLES[t.category ?? 'income'] ?? CATEGORY_STYLES.other
              }`}>
                {t.category ? t.category.replace(/_/g, ' ') : 'Income'}
              </span>
            ) : '—'}
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-sm font-semibold tabular-nums ${
            t.type === 'income' ? 'text-chart-1' : 'text-chart-2'
          }`}
        >
          {formatAmount(t)}
        </span>
      </button>
    );
  }

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
        <div className="space-y-6">
          {recurring.length > 0 && (
            <div>
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Recurring</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Net {recurringTotals.net}</p>
                <p className="text-xs text-muted-foreground pl-6">{recurringTotals.income} income · {recurringTotals.expenses} expenses</p>
              </div>
              <div className="bg-card rounded-xl ring-1 ring-border overflow-hidden">
                {recurring.map((t, i) => renderRow(t, i))}
              </div>
            </div>
          )}

          {oneTime.length > 0 && (
            <div>
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">One-time</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Net {oneTimeTotals.net}</p>
                <p className="text-xs text-muted-foreground pl-6">{oneTimeTotals.income} income · {oneTimeTotals.expenses} expenses</p>
              </div>
              <div className="bg-card rounded-xl ring-1 ring-border overflow-hidden">
                {oneTime.map((t, i) => renderRow(t, i))}
              </div>
            </div>
          )}
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
