'use client';



import Link from 'next/link';

import { useCourse } from '@/hooks/useCourses';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import {

  AcademicStatusBadge,

  CourseTypeBadge,

  formatDate,

} from '@/components/academic/AcademicBadges';

import { getErrorMessage } from '@/utils/cn';



interface CourseDetailsPageProps {

  courseId: string;

}



export function CourseDetailsPage({ courseId }: CourseDetailsPageProps) {

  const { data, isLoading, isError, error, refetch } = useCourse(courseId);



  if (isLoading) return <Loading label="Loading course details..." />;

  if (isError || !data) {

    return (

      <ErrorState

        message={getErrorMessage(error, 'Failed to load course')}

        onRetry={() => refetch()}

      />

    );

  }



  return (

    <div className="mx-auto max-w-4xl space-y-6">

      <Breadcrumb

        items={[

          { label: 'Dashboard', href: '/dashboard/college-admin' },

          { label: 'Courses', href: '/dashboard/college-admin/courses' },

          { label: data.name },

        ]}

      />



      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">

            {data.name}

          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">{data.code}</p>

        </div>

        <div className="flex gap-2">

          <Link

            href="/dashboard/college-admin/courses"

            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"

          >

            Back

          </Link>

          <Link

            href={`/dashboard/college-admin/courses/${data.id}/edit`}

            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"

          >

            Edit

          </Link>

        </div>

      </div>



      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <div className="flex flex-wrap items-center gap-3">

          <AcademicStatusBadge status={data.status} />

          <CourseTypeBadge type={data.courseType} />

          <span className="text-sm text-[var(--muted)]">

            {data._count?.semesters ?? 0} semesters

          </span>

        </div>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">

          <Detail label="Department" value={data.department?.name} />

          <Detail label="Duration" value={String(data.duration)} />

          <Detail label="Created" value={formatDate(data.createdAt)} />

          <Detail label="Updated" value={formatDate(data.updatedAt)} />

          <div className="sm:col-span-2">

            <Detail label="Description" value={data.description} />

          </div>

        </dl>

      </section>

    </div>

  );

}



function Detail({ label, value }: { label: string; value: string | null | undefined }) {

  return (

    <div>

      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>

      <dd className="mt-1 break-words font-semibold text-[var(--foreground)]">{value || '—'}</dd>

    </div>

  );

}

