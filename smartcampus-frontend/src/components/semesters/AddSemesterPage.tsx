'use client';



import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { SemesterForm } from '@/components/semesters/SemesterForm';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { EmptyState } from '@/components/EmptyState';

import { useCreateSemester } from '@/hooks/useSemesters';

import { useCourses } from '@/hooks/useCourses';

import type { SemesterFormValues } from '@/utils/academicValidation';

import { getErrorMessage } from '@/utils/cn';



export function AddSemesterPage() {

  const router = useRouter();

  const createMutation = useCreateSemester();

  const {

    data: coursesData,

    isLoading,

    isError,

    error,

    refetch,

  } = useCourses({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc', status: 'ACTIVE' });



  if (isLoading) return <Loading label="Loading courses..." />;

  if (isError) {

    return (

      <ErrorState

        message={getErrorMessage(error, 'Failed to load courses')}

        onRetry={() => refetch()}

      />

    );

  }



  const courses = coursesData?.items ?? [];



  if (courses.length === 0) {

    return (

      <EmptyState

        title="Create a course first"

        description="Semesters must belong to a course in your college."

        action={

          <Link

            href="/dashboard/college-admin/courses/new"

            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"

          >

            Add course

          </Link>

        }

      />

    );

  }



  const onSubmit = (values: SemesterFormValues) => {

    createMutation.mutate(

      {

        courseId: values.courseId,

        semesterNumber: values.semesterNumber,

        name: values.name,

        startDate: new Date(values.startDate).toISOString(),

        endDate: new Date(values.endDate).toISOString(),

        status: values.status,

      },

      {

        onSuccess: (response) => {

          const id = response.data?.semester.id;

          router.push(

            id

              ? `/dashboard/college-admin/semesters/${id}`

              : '/dashboard/college-admin/semesters'

          );

        },

      }

    );

  };



  return (

    <div className="mx-auto max-w-3xl space-y-6">

      <Breadcrumb

        items={[

          { label: 'Dashboard', href: '/dashboard/college-admin' },

          { label: 'Semesters', href: '/dashboard/college-admin/semesters' },

          { label: 'Add' },

        ]}

      />

      <div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">

          Add Semester

        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">

          Define an academic term for a course.

        </p>

      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <SemesterForm

          courses={courses}

          submitLabel="Create semester"

          loading={createMutation.isPending}

          error={createMutation.error}

          onSubmit={onSubmit}

        />

      </div>

    </div>

  );

}

