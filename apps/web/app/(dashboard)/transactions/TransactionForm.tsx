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
    status: t?.status ?? 'completed',
    amount: t?.amount != null ? String(t.amount) : '',
    description: t?.description ?? '',
    category: t?.category ?? undefined,
    date: t?.date ?? new Date().toISOString().slice(0, 10),
  };
}

export default function TransactionForm({ transaction, onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(() => defaultForm(transaction));
  const [error, setError] = useState('');

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const invalidate = () => qc.invalidateQueries({ queryKey: ['transactions'] });

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
      status: form.status as CreateTransactionPayload['status'],
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {transaction ? 'Edit transaction' : 'New transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            {(['income', 'expense'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: t, category: undefined }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={set('amount')}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Monthly rent"
              value={form.description}
              onChange={set('description')}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Category — expenses only */}
          {form.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category ?? ''}
                onChange={set('category')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Recurrence + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
              <select
                value={form.recurrence}
                onChange={set('recurrence')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="one_time">One time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={set('status')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            {transaction && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm('Delete this transaction?')) deleteMutation.mutate();
                }}
                className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? 'Saving...' : transaction ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
