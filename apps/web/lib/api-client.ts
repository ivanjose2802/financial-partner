const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: customHeaders, ...restOptions } = options ?? {};
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...customHeaders },
    ...restOptions,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message ?? 'Request failed');
  }

  return data as T;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fp_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

import {
  EXPENSE_CATEGORIES,
} from '@financial-partner/shared';
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  Recurrence,
  ExpenseCategory,
  PaginatedResponse,
  DashboardResponse,
} from '@financial-partner/shared';

export { EXPENSE_CATEGORIES };
export type { Transaction, TransactionType, TransactionStatus, Recurrence, ExpenseCategory, DashboardResponse };

export interface CreateTransactionPayload {
  type: TransactionType;
  recurrence: Recurrence;
  status: TransactionStatus;
  amount: number;
  description: string;
  category?: ExpenseCategory;
  date: string;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}

export interface TransactionFilters {
  month?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  page?: number;
  limit?: number;
}

export const transactionsApi = {
  list: (filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (filters.month) params.set('month', filters.month);
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const qs = params.toString();
    return request<PaginatedResponse<Transaction>>(`/transactions${qs ? `?${qs}` : ''}`, {
      headers: authHeaders(),
    });
  },

  create: (body: CreateTransactionPayload): Promise<Transaction> =>
    request<Transaction>('/transactions', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }),

  update: (id: string, body: UpdateTransactionPayload): Promise<Transaction> =>
    request<Transaction>(`/transactions/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }),

  remove: (id: string): Promise<void> =>
    request<void>(`/transactions/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),
};

export const dashboardApi = {
  getSummary: (month?: string): Promise<DashboardResponse> => {
    const qs = month ? `?month=${encodeURIComponent(month)}` : '';
    return request<DashboardResponse>(`/dashboard/summary${qs}`, {
      headers: authHeaders(),
    });
  },
};

export const authApi = {
  register: (body: {
    email: string;
    password: string;
    name?: string;
    lastName?: string;
  }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
