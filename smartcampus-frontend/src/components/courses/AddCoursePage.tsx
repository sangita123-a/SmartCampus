'use client';



import { useRouter } from 'next/navigation';

import { CourseForm } from '@/components/courses/CourseForm';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { EmptyState } from '@/components/EmptyState';

import { useCreateCourse } from '@/hooks/useCourses';

import { useDepartments } from '@/hooks/useDepartments';

import type { CourseFormValues } from '@/utils/academicValidation';

import { getErrorMessage } from '@/utils/cn';

import Link from 'next/link';



export function AddCoursePage() {

  const router = useRouter();

  const createMutation = useCreateCourse();

  const {

    data: departmentsData,

    isLoading,

    isError,

    error,

    refetch,

  } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc', status: 'ACTIVE' });



  if (isLoading) return <Loading label="Loading departments..." />;

  if (isError) {

    return (

      <ErrorState

        message={getErrorMessage(error, 'Failed to load departments')}

        onRetry={() => refetch()}

      />

    );

  }



  const departments = departmentsData?.items ?? [];



  if (departments.length === 0) {

    return (

      <EmptyState

        title="Create a department first"

        description="Courses must belong to a department in your college."

        action={

          <Link

            href="/dashboard/college-admin/departments/new"

            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"

          >

            Add department

          </Link>

        }

      />

    );

  }



  const onSubmit = (values: CourseFormValues) => {

    createMutation.mutate(

      {

        departmentId: values.departmentId,

        name: values.name,

        code: values.code,

        duration: values.duration,

        courseType: values.courseType,

        description: values.description || null,

        status: values.status,

      },

      {

        onSuccess: (response) => {

          const id = response.data?.course.id;

          router.push(

            id ? `/dashboard/college-admin/courses/${id}` : '/dashboard/college-admin/courses'

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

          { label: 'Courses', href: '/dashboard/college-admin/courses' },

          { label: 'Add' },

        ]}

      />

      <div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">

          Add Course

        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">

          Create a course under one of your departments.

        </p>

      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <CourseForm

          departments={departments}

          submitLabel="Create course"

          loading={createMutation.isPending}

          error={createMutation.error}

          onSubmit={onSubmit}

        />

      </div>

    </div>

  );

}

