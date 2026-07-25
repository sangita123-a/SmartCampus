'use client';

import Link from 'next/link';
import {
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { useFacultyDashboard } from '@/hooks/useFaculty';
import { StatCard } from '@/components/ui/StatCard';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { getErrorMessage } from '@/utils/cn';
import type { FacultyDashboardStats } from '@/types';

type DeptRow = FacultyDashboardStats['facultyByDepartment'][number];

export function FacultyDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useFacultyDashboard();

  const columns: Array<DataTableColumn<DeptRow>> = [
    {
      key: 'department',
      header: 'Department',
      render: (row) => row.departmentName,
    },
    {
      key: 'count',
      header: 'Faculty count',
      render: (row) => row.count,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Faculty Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {data?.college
              ? `${data.college.name} — live faculty metrics for your college.`
              : 'Live faculty metrics for your college.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/college-admin/faculty"
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
          >
            View faculty
          </Link>
          <Link
            href="/dashboard/college-admin/faculty/new"
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Add faculty
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Loading label="Loading faculty stats..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load faculty dashboard')}
          onRetry={() => refetch()}
        />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Faculty" value={data.totalFaculty} icon={Users} />
            <StatCard title="Active Faculty" value={data.activeFaculty} icon={UserCheck} />
            <StatCard title="Inactive Faculty" value={data.inactiveFaculty} icon={UserMinus} />
            <StatCard title="New Faculty" value={data.newFaculty} icon={UserPlus} />
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Faculty by Department
            </h2>
            {data.facultyByDepartment.length === 0 ? (
              <EmptyState
                title="No faculty assigned"
                description="Add faculty members to see department distribution."
              />
            ) : (
              <DataTable
                columns={columns}
                rows={data.facultyByDepartment}
                rowKey={(row) => row.departmentId}
              />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
