'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (href: string) =>
    pathname === href
      ? 'text-sm font-medium text-foreground border-b-2 border-primary pb-0.5'
      : 'text-sm text-muted-foreground hover:text-foreground transition-colors';

  const mobileNavLink = (href: string) =>
    pathname === href
      ? 'flex items-center px-3 py-2 rounded-lg text-sm font-medium text-foreground bg-accent'
      : 'flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 relative">
      <nav className="border-b border-border bg-background px-6 py-3 flex items-center justify-between">
        {/* Brand + desktop nav links */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-foreground">
            Finpartner
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className={navLink('/dashboard')}>
              Overview
            </Link>
            <Link href="/transactions" className={navLink('/transactions')}>
              Transactions
            </Link>
            <Link href="/goals" className={navLink('/goals')}>
              Goals
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {/* Desktop: email + logout */}
          <div className="hidden md:flex items-center gap-4 ml-2">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu — overlays content */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40 border-b border-border bg-background shadow-md px-6 py-4 flex flex-col gap-1">
          <Link href="/dashboard" className={mobileNavLink('/dashboard')}>
            Overview
          </Link>
          <Link href="/transactions" className={mobileNavLink('/transactions')}>
            Transactions
          </Link>
          <Link href="/goals" className={mobileNavLink('/goals')}>
            Goals
          </Link>
          <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
            <span className="text-sm text-muted-foreground px-3">{user?.email}</span>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      </div>
      <main className="max-w-[1400px] mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
