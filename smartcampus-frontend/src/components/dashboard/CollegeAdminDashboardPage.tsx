'use client';



import Link from 'next/link';

import {

  BookOpen,

  CalendarRange,

  GraduationCap,

  Layers,

  UserCheck,

} from 'lucide-react';

import { useCollegeAdminDashboard } from '@/hooks/useCollegeAdmin';

import { StatCard } from '@/components/ui/StatCard';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { getErrorMessage } from '@/utils/cn';



export function CollegeAdminDashboardPage() {

  const { data, isLoading, isError, error, refetch } = useCollegeAdminDashboard();



  return (

    <div className="mx-auto max-w-6xl space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">

            College Admin Dashboard

          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">

            {data?.college

              ? `${data.college.name} (${data.college.code}) — live metrics for your college only.`

              : 'Live metrics for your college only.'}

          </p>

        </div>

        <div className="flex flex-wrap gap-2">

          <Link

            href="/dashboard/college-admin/departments"

            className="inline-flex justify-center rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"

          >

            Departments

          </Link>

          <Link

            href="/dashboard/college-admin/courses"

            className="inline-flex justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"

          >

            Manage courses

          </Link>

        </div>

      </div>



      {isLoading ? (

        <Loading label="Loading dashboard stats..." />

      ) : isError ? (

        <ErrorState

          message={getErrorMessage(error, 'Failed to load dashboard')}

          onRetry={() => refetch()}

        />

      ) : data ? (

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <StatCard title="Total Departments" value={data.totalDepartments} icon={Layers} />

          <StatCard title="Total Courses" value={data.totalCourses} icon={BookOpen} />

          <StatCard title="Total Semesters" value={data.totalSemesters} icon={CalendarRange} />

          <StatCard title="Active Students" value={data.activeStudents} icon={GraduationCap} />

          <StatCard title="Active Faculty" value={data.activeFaculty} icon={UserCheck} />

        </div>

      ) : null}

    </div>

  );

}

