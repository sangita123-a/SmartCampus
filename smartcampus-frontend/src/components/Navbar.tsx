'use client';

import Link from 'next/link';
import { Menu, X, GraduationCap, LogOut, UserRound } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/types/roles';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const marketingLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/modules', label: 'Modules' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Login' },
];

interface NavbarProps {
  variant?: 'marketing' | 'app';
  onMenuClick?: () => void;
  className?: string;
}

export function Navbar({ variant = 'marketing', onMenuClick, className }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logoutMutation = useLogoutMutation();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md',
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-6">
        <div className="flex items-center gap-3">
          {variant === 'app' && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg tracking-tight">
              SmartCampus
            </span>
          </Link>
        </div>

        {variant === 'marketing' && (
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-8 md:flex">
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--muted)] transition hover:text-teal-800 dark:hover:text-teal-300"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register"
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Get started
              </Link>
            </nav>
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        )}

        {variant === 'app' && isAuthenticated && user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
              <p className="text-xs text-[var(--muted)]">{ROLE_LABELS[user.role]}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              <UserRound className="h-4 w-4" aria-hidden />
            </div>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              {logoutMutation.isPending ? 'Signing out…' : 'Logout'}
            </button>
          </div>
        )}
      </div>

      {variant === 'marketing' && open && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {marketingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-teal-700 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
