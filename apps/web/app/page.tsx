'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Financial Partner</h1>

      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-600">
            Welcome, {user?.name ?? user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Create account
          </Link>
        </div>
      )}
    </main>
  );
}
