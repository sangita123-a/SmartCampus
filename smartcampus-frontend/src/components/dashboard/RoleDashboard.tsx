'use client';

import { useAuthStore } from '@/store/auth.store';
import { ROLE_LABELS } from '@/types/roles';
import { useCurrentUser } from '@/hooks/useAuth';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';

interface RoleDashboardProps {
  title: string;
  description: string;
}

export function RoleDashboard({ title, description }: RoleDashboardProps) {
  const storedUser = useAuthStore((s) => s.user);
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser(true);
  const profile = user ?? storedUser;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Profile
        </h2>

        {isLoading && !profile ? (
          <div className="mt-4">
            <Loading label="Loading profile from API..." />
          </div>
        ) : isError && !profile ? (
          <div className="mt-4">
            <ErrorState
              message={error instanceof Error ? error.message : 'Failed to load profile'}
              onRetry={() => refetch()}
            />
          </div>
        ) : profile ? (
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Role</dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                {ROLE_LABELS[profile.role]}
              </dd>
            </div>
          </dl>
        ) : null}
      </section>
    </div>
  );
}
