'use client';

import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  BadgeCheck,
  AlertTriangle,
} from 'lucide-react';
import { useSuperAdminDashboard } from '@/hooks/useColleges';
import { StatCard } from '@/components/ui/StatCard';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { PlanBadge, StatusBadge, formatDate } from '@/components/colleges/CollegeBadges';
import { getErrorMessage } from '@/utils/cn';
import type { SuperAdminDashboardStats } from '@/types';

type RecentCollege = SuperAdminDashboardStats['recentRegistrations'][number];

export function SuperAdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useSuperAdminDashboard();

  const recentColumns: Array<DataTableColumn<RecentCollege>> = [
    {
      key: 'name',
      header: 'College',
      render: (row) => (
        <Link
          href={`/dashboard/super-admin/colleges/${row.id}`}
          className="font-semibold text-teal-800 hover:underline dark:text-teal-300"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      render: (row) => row.code,
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
      key: 'created',
      header: 'Registered',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Super Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Multi-tenant platform overview from live API metrics.
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/colleges"
          className="inline-flex justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Manage colleges
        </Link>
      </div>

      {isLoading ? (
        <Loading label="Loading dashboard stats..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load dashboard')}
          onRetry={() => refetch()}
        />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Total Colleges" value={data?.totalColleges ?? 0} icon={Building2} />
            <StatCard title="Total Students" value={data?.totalStudents ?? 0} icon={GraduationCap} />
            <StatCard title="Total Faculty" value={data?.totalFaculty ?? 0} icon={UserCheck} />
            <StatCard title="Total Users" value={data?.totalUsers ?? 0} icon={Users} />
            <StatCard title="Active Colleges" value={data?.activeColleges ?? 0} icon={BadgeCheck} />
            <StatCard title="Expired Plans" value={data?.expiredPlans ?? 0} icon={AlertTriangle} />
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                Recent Registrations
              </h2>
            </div>
            {(data?.recentRegistrations ?? []).length === 0 ? (
              <EmptyState
                title="No colleges registered"
                description="New college tenants will appear here after creation."
              />
            ) : (
              <DataTable
                columns={recentColumns}
                rows={data?.recentRegistrations ?? []}
                rowKey={(row) => row.id}
              />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
