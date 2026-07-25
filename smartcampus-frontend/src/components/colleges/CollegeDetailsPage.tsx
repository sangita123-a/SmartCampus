'use client';

import Link from 'next/link';
import { useCollege } from '@/hooks/useColleges';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { PlanBadge, StatusBadge, formatDate } from '@/components/colleges/CollegeBadges';
import { getErrorMessage } from '@/utils/cn';

interface CollegeDetailsPageProps {
  collegeId: string;
}

export function CollegeDetailsPage({ collegeId }: CollegeDetailsPageProps) {
  const { data, isLoading, isError, error, refetch } = useCollege(collegeId);

  if (isLoading) return <Loading label="Loading college details..." />;
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load college')}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            {data.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{data.code}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/super-admin/colleges"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            Back
          </Link>
          <Link
            href={`/dashboard/super-admin/colleges/${data.id}/edit`}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Edit
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Subscription
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <PlanBadge plan={data.subscriptionPlan} />
          <StatusBadge status={data.status} />
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Current plan</dt>
            <dd className="mt-1 font-semibold">{data.subscriptionPlan}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Status</dt>
            <dd className="mt-1 font-semibold">{data.status}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Start</dt>
            <dd className="mt-1 font-semibold">{formatDate(data.subscriptionStart)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Expiry date</dt>
            <dd className="mt-1 font-semibold">{formatDate(data.subscriptionEnd)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          College details
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Detail label="Email" value={data.email} />
          <Detail label="Phone" value={data.phone} />
          <Detail label="Website" value={data.website} />
          <Detail label="Address" value={data.address} />
          <Detail label="Created" value={formatDate(data.createdAt)} />
          <Detail label="Updated" value={formatDate(data.updatedAt)} />
        </dl>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-[var(--foreground)]">{value || '—'}</dd>
    </div>
  );
}
