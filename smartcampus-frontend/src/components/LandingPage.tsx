'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Server } from 'lucide-react';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { useHealthStatus } from '@/hooks/useHealthStatus';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';

export function LandingPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHealthStatus();

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,148,136,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.08),transparent_35%),linear-gradient(180deg,#f7faf9_0%,#e8f4f1_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:py-24">
          <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-teal-900 sm:text-5xl md:text-6xl">
            SmartCampus
          </p>
          <h1 className="mt-4 max-w-2xl text-2xl font-medium leading-snug text-slate-800 sm:text-3xl">
            Modern college ERP infrastructure for admissions, academics, and campus operations.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
            A production-ready SaaS foundation with separated frontend and backend, PostgreSQL, and
            API-first architecture.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900">
            Platform status
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Live health check from the SmartCampus backend API — no hardcoded status data.
          </p>

          <div className="mt-8">
            {isLoading || isFetching ? (
              <Loading label="Checking backend health..." />
            ) : isError ? (
              <ErrorState
                title="Backend unreachable"
                message={
                  error instanceof Error
                    ? error.message
                    : 'Unable to reach the API. Ensure the backend is running and NEXT_PUBLIC_API_URL is set.'
                }
                onRetry={() => refetch()}
              />
            ) : data ? (
              <div className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                  <Server className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-700" aria-hidden />
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
                      API online
                    </p>
                  </div>
                  <p className="mt-1 text-lg font-medium text-slate-900">{data.message}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    success: {String(data.success)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900">
            Built for scale
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            This foundation ships with Next.js, Express, Prisma, PostgreSQL, JWT scaffolding, and a
            modular folder architecture. Business modules will be added in later phases.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:underline"
          >
            Open dashboard shell
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
