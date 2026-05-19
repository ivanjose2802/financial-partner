'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '../../../lib/api-client';
import { useAuth } from '../../../lib/auth-context';

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '', name: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken, user } = await authApi.register(form);
      login(accessToken, user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-foreground">Create account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              First name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              className={inputClass}
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Last name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={set('lastName')}
              className={inputClass}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Password{' '}
            <span className="font-normal text-muted-foreground">(min. 8 chars)</span>
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={set('password')}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
