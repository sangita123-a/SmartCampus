'use client';



import { useRouter } from 'next/navigation';

import { CourseForm } from '@/components/courses/CourseForm';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { useCourse, useUpdateCourse } from '@/hooks/useCourses';

import { useDepartments } from '@/hooks/useDepartments';

import type { CourseFormValues } from '@/utils/academicValidation';

import { getErrorMessage } from '@/utils/cn';



interface EditCoursePageProps {

  courseId: string;

}



export function EditCoursePage({ courseId }: EditCoursePageProps) {

  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useCourse(courseId);

  const {

    data: departmentsData,

    isLoading: departmentsLoading,

    isError: departmentsError,

    error: departmentsErr,

    refetch: refetchDepartments,

  } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });

  const updateMutation = useUpdateCourse(courseId);



  if (isLoading || departmentsLoading) return <Loading label="Loading course..." />;

  if (isError || !data) {

    return (

      <ErrorState

        message={getErrorMessage(error, 'Failed to load course')}

        onRetry={() => refetch()}

      />

    );

  }

  if (departmentsError) {

    return (

      <ErrorState

        message={getErrorMessage(departmentsErr, 'Failed to load departments')}

        onRetry={() => refetchDepartments()}

      />

    );

  }



  const onSubmit = (values: CourseFormValues) => {

    updateMutation.mutate(

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

        onSuccess: () => {

          router.push(`/dashboard/college-admin/courses/${courseId}`);

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

          { label: data.name, href: `/dashboard/college-admin/courses/${data.id}` },

          { label: 'Edit' },

        ]}

      />

      <div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">

          Edit Course

        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">Update course details.</p>

      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <CourseForm

          initialValues={data}

          departments={departmentsData?.items ?? []}

          submitLabel="Save changes"

          loading={updateMutation.isPending}

          error={updateMutation.error}

          onSubmit={onSubmit}

        />

      </div>

    </div>

  );

}

