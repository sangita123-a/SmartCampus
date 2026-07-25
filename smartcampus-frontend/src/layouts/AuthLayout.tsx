import type { ReactNode } from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_#d9f3ec_0%,_#f7faf9_45%,_#eef2f6_100%)]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900">
            SmartCampus
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-28px_rgba(15,118,110,0.45)] backdrop-blur sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
