'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  transactionsApi,
  EXPENSE_CATEGORIES,
  type Transaction,
  type CreateTransactionPayload,
} from '@/lib/api-client';

const CATEGORY_LABELS: Record<string, string> = {
  housing: 'Housing',
  utilities: 'Utilities',
  services: 'Services (water, gas, electric, internet...)',
  transportation: 'Transportation',
  food: 'Food',
  restaurants: 'Restaurants',
  entertainment: 'Entertainment',
  health: 'Health',
  insurance: 'Insurance',
  family_support: 'Family support',
  education: 'Education',
  debt_payments: 'Debt payments',
  subscriptions: 'Subscriptions',
  savings: 'Savings',
  other: 'Other',
};

interface Props {
  transaction?: Transaction;
  onClose: () => void;
}

type FormState = Omit<CreateTransactionPayload, 'amount'> & { amount: string };

function defaultForm(t?: Transaction): FormState {
  return {
    type: t?.type ?? 'expense',
    recurrence: t?.recurrence ?? 'one_time',
    amount: t?.amount != null ? String(parseFloat(String(t.amount))) : '',
    description: t?.description ?? '',
    category: t?.category ?? undefined,
    date: t?.date ?? new Date().toISOString().slice(0, 10),
  };
}

const DESCRIPTION_PLACEHOLDER: Record<string, string> = {
  income: 'e.g. Monthly salary, freelance payment, bonus...',
  expense: 'e.g. Monthly rent, groceries, Netflix...',
};

function formatCurrency(raw: string): string {
  if (!raw) return '';
  const num = parseFloat(raw);
  if (isNaN(num)) return raw;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const inputClass =
  'w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground';

const labelClass = 'block text-sm font-medium text-foreground mb-1';

export default function TransactionForm({ transaction, onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(() => defaultForm(transaction));
  const [error, setError] = useState('');
  const [amountFocused, setAmountFocused] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['transactions'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionsApi.create(payload),
    onSuccess: () => { invalidate(); onClose(); },
    onError: (e: Error) => setError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionsApi.update(transaction!.id, payload),
    onSuccess: () => { invalidate(); onClose(); },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => transactionsApi.remove(transaction!.id),
    onSuccess: () => { invalidate(); onClose(); },
    onError: (e: Error) => setError(e.message),
  });

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    const payload: CreateTransactionPayload = {
      type: form.type as CreateTransactionPayload['type'],
      recurrence: form.recurrence as CreateTransactionPayload['recurrence'],
      amount,
      description: form.description,
      date: form.date,
      ...(form.type === 'expense' && form.category ? { category: form.category as CreateTransactionPayload['category'] } : {}),
    };
    if (transaction) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            {transaction ? 'Edit transaction' : 'New transaction'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none transition-colors">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(['income', 'expense'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: t, category: undefined }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-chart-1 text-white'
                      : 'bg-chart-2 text-white'
                    : 'bg-card text-muted-foreground hover:bg-accent'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amountFocused ? form.amount : formatCurrency(form.amount)}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = val.split('.');
                  if (parts.length === 2 && parts[1].length > 2) return;
                  const cleaned = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : val;
                  setForm((prev) => ({ ...prev, amount: cleaned }));
                }}
                required
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              placeholder={DESCRIPTION_PLACEHOLDER[form.type]}
              value={form.description}
              onChange={set('description')}
              required
              className={inputClass}
            />
          </div>

          {/* Category — expenses only */}
          {form.type === 'expense' && (
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category ?? ''}
                onChange={set('category')}
                className={inputClass}
              >
                <option value="">Select a category</option>
                {(EXPENSE_CATEGORIES as readonly string[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c] ?? c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
              required
              className={`${inputClass} min-w-0`}
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className={labelClass}>Recurrence</label>
            <select
              value={form.recurrence}
              onChange={set('recurrence')}
              className={inputClass}
            >
              <option value="one_time">One time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            {transaction && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm('Delete this transaction?')) deleteMutation.mutate();
                }}
                className="px-4 py-2 text-sm rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isPending ? 'Saving...' : transaction ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
