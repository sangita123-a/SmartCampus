'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  useColleges,
  useDeactivateCollege,
  useDeleteCollege,
  useReactivateCollege,
} from '@/hooks/useColleges';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { PlanBadge, StatusBadge, formatDate } from '@/components/colleges/CollegeBadges';
import type { College, CollegeStatus, SubscriptionPlan } from '@/types';
import { getErrorMessage } from '@/utils/cn';

type ActionTarget = { college: College; action: 'deactivate' | 'reactivate' | 'delete' };

export function CollegeListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<CollegeStatus | ''>('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | ''>('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [confirmTarget, setConfirmTarget] = useState<ActionTarget | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: status || undefined,
      subscriptionPlan: subscriptionPlan || undefined,
      sortBy,
      sortOrder,
    }),
    [page, search, status, subscriptionPlan, sortBy, sortOrder]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useColleges(params);
  const deactivateMutation = useDeactivateCollege();
  const reactivateMutation = useReactivateCollege();
  const deleteMutation = useDeleteCollege();

  const actionLoading =
    deactivateMutation.isPending || reactivateMutation.isPending || deleteMutation.isPending;

  const columns: Array<DataTableColumn<College>> = [
    {
      key: 'name',
      header: 'College',
      render: (row) => (
        <div>
          <Link
            href={`/dashboard/super-admin/colleges/${row.id}`}
            className="font-semibold text-teal-800 hover:underline dark:text-teal-300"
          >
            {row.name}
          </Link>
          <p className="text-xs text-[var(--muted)]">{row.code}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="text-[var(--foreground)]">{row.email}</span>,
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => <PlanBadge plan={row.subscriptionPlan} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'expiry',
      header: 'Expires',
      render: (row) => formatDate(row.subscriptionEnd),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/super-admin/colleges/${row.id}/edit`}
            className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-300"
          >
            Edit
          </Link>
          {row.status === 'ACTIVE' ? (
            <button
              type="button"
              className="text-xs font-semibold text-amber-700 hover:underline"
              onClick={() => setConfirmTarget({ college: row, action: 'deactivate' })}
            >
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              className="text-xs font-semibold text-teal-700 hover:underline"
              onClick={() => setConfirmTarget({ college: row, action: 'reactivate' })}
            >
              Reactivate
            </button>
          )}
          <button
            type="button"
            className="text-xs font-semibold text-red-700 hover:underline"
            onClick={() => setConfirmTarget({ college: row, action: 'delete' })}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const onConfirm = async () => {
    if (!confirmTarget) return;
    const { college, action } = confirmTarget;

    try {
      if (action === 'deactivate') await deactivateMutation.mutateAsync(college.id);
      if (action === 'reactivate') await reactivateMutation.mutateAsync(college.id);
      if (action === 'delete') await deleteMutation.mutateAsync(college.id);
      setConfirmTarget(null);
    } catch {
      // Error surfaces via mutation state if needed; keep dialog open on failure
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Colleges
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage tenants, subscriptions, and college status.
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/colleges/new"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Add college
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <form
          className="sm:col-span-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setSearch(searchInput.trim());
          }}
        >
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Search
          </label>
          <div className="flex gap-2">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, code, or email"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-teal-600"
            />
            <button
              type="submit"
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              Go
            </button>
          </div>
        </form>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Status
          </label>
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as CollegeStatus | '');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Plan
          </label>
          <select
            value={subscriptionPlan}
            onChange={(event) => {
              setPage(1);
              setSubscriptionPlan(event.target.value as SubscriptionPlan | '');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="FREE">FREE</option>
            <option value="BASIC">BASIC</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Sort
          </label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="createdAt">Created</option>
              <option value="name">Name</option>
              <option value="code">Code</option>
              <option value="status">Status</option>
              <option value="subscriptionPlan">Plan</option>
              <option value="subscriptionEnd">Expiry</option>
            </select>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading label="Loading colleges..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load colleges')}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No colleges yet"
          description="Create your first tenant college to start multi-tenant operations."
          action={
            <Link
              href="/dashboard/super-admin/colleges/new"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Add college
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <p>
              Showing page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              {isFetching ? ' · Refreshing…' : ''}
            </p>
          </div>
          <DataTable columns={columns} rows={data.items} rowKey={(row) => row.id} />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title={
          confirmTarget?.action === 'delete'
            ? 'Delete college'
            : confirmTarget?.action === 'deactivate'
              ? 'Deactivate college'
              : 'Reactivate college'
        }
        description={
          confirmTarget?.action === 'delete'
            ? `Delete ${confirmTarget.college.name}? If users are linked, the college will be deactivated instead.`
            : confirmTarget?.action === 'deactivate'
              ? `Deactivate ${confirmTarget?.college.name}? Tenant users will remain but the college will be marked inactive.`
              : `Reactivate ${confirmTarget?.college.name}?`
        }
        confirmLabel={
          confirmTarget?.action === 'delete'
            ? 'Delete'
            : confirmTarget?.action === 'deactivate'
              ? 'Deactivate'
              : 'Reactivate'
        }
        tone={confirmTarget?.action === 'delete' ? 'danger' : 'default'}
        loading={actionLoading}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => void onConfirm()}
      />
    </div>
  );
}
