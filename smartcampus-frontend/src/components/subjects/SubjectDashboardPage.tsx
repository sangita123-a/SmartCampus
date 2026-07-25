'use client';

import Link from 'next/link';
import {
  BookMarked,
  BookOpenCheck,
  Layers,
  UserMinus,
  UserCheck,
} from 'lucide-react';
import { useSubjectDashboard } from '@/hooks/useSubjects';
import { StatCard } from '@/components/ui/StatCard';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { getErrorMessage } from '@/utils/cn';
import type { SubjectDashboardStats } from '@/types';

type DeptRow = SubjectDashboardStats['subjectsByDepartment'][number];
type SemRow = SubjectDashboardStats['subjectsBySemester'][number];

export function SubjectDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useSubjectDashboard();

  const deptColumns: Array<DataTableColumn<DeptRow>> = [
    {
      key: 'department',
      header: 'Department',
      render: (row) => row.departmentName,
    },
    {
      key: 'count',
      header: 'Subjects',
      render: (row) => row.count,
    },
  ];

  const semColumns: Array<DataTableColumn<SemRow>> = [
    {
      key: 'semester',
      header: 'Semester',
      render: (row) => row.semesterName,
    },
    {
      key: 'count',
      header: 'Subjects',
      render: (row) => row.count,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Subject Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {data?.college
              ? `${data.college.name} — live subject metrics for your college.`
              : 'Live subject metrics for your college.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/college-admin/subjects"
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
          >
            View subjects
          </Link>
          <Link
            href="/dashboard/college-admin/subjects/new"
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Add subject
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Loading label="Loading subject stats..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load subject dashboard')}
          onRetry={() => refetch()}
        />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Subjects" value={data.totalSubjects} icon={BookMarked} />
            <StatCard title="Assigned" value={data.assignedSubjects} icon={UserCheck} />
            <StatCard title="Unassigned" value={data.unassignedSubjects} icon={UserMinus} />
            <StatCard title="Active" value={data.activeSubjects} icon={BookOpenCheck} />
          </div>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              <Layers className="h-4 w-4" />
              Department-wise Subjects
            </h2>
            {data.subjectsByDepartment.length === 0 ? (
              <EmptyState
                title="No subjects yet"
                description="Create subjects to see department distribution."
              />
            ) : (
              <DataTable
                columns={deptColumns}
                rows={data.subjectsByDepartment}
                rowKey={(row) => row.departmentId}
              />
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Semester-wise Subjects
            </h2>
            {data.subjectsBySemester.length === 0 ? (
              <EmptyState
                title="No semester breakdown"
                description="Subjects will group by semester once created."
              />
            ) : (
              <DataTable
                columns={semColumns}
                rows={data.subjectsBySemester}
                rowKey={(row) => row.semesterId}
              />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
