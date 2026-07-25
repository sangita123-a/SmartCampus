'use client';

import Link from 'next/link';
import { GraduationCap, UserCheck, UserMinus, UserPlus } from 'lucide-react';
import { useStudentDashboard } from '@/hooks/useStudents';
import { StatCard } from '@/components/ui/StatCard';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { getErrorMessage } from '@/utils/cn';

export function StudentDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useStudentDashboard();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Student Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {data?.college
              ? `${data.college.name} — live student metrics for your college.`
              : 'Live student metrics for your college.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/college-admin/students"
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
          >
            View students
          </Link>
          <Link
            href="/dashboard/college-admin/students/new"
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Add student
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Loading label="Loading student stats..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load student dashboard')}
          onRetry={() => refetch()}
        />
      ) : data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Students" value={data.totalStudents} icon={GraduationCap} />
          <StatCard title="Active Students" value={data.activeStudents} icon={UserCheck} />
          <StatCard title="Inactive Students" value={data.inactiveStudents} icon={UserMinus} />
          <StatCard title="New Admissions" value={data.newAdmissions} icon={UserPlus} />
        </div>
      ) : null}
    </div>
  );
}
