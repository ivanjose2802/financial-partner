'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-gray-900">
            Financial Partner
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/transactions"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Transactions
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
