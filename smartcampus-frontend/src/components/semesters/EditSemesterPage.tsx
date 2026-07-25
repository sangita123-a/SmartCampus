'use client';



import { useRouter } from 'next/navigation';

import { SemesterForm } from '@/components/semesters/SemesterForm';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { useSemester, useUpdateSemester } from '@/hooks/useSemesters';

import { useCourses } from '@/hooks/useCourses';

import type { SemesterFormValues } from '@/utils/academicValidation';

import { getErrorMessage } from '@/utils/cn';



interface EditSemesterPageProps {

  semesterId: string;

}



export function EditSemesterPage({ semesterId }: EditSemesterPageProps) {

  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useSemester(semesterId);

  const {

    data: coursesData,

    isLoading: coursesLoading,

    isError: coursesError,

    error: coursesErr,

    refetch: refetchCourses,

  } = useCourses({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });

  const updateMutation = useUpdateSemester(semesterId);



  if (isLoading || coursesLoading) return <Loading label="Loading semester..." />;

  if (isError || !data) {

    return (

      <ErrorState

        message={getErrorMessage(error, 'Failed to load semester')}

        onRetry={() => refetch()}

      />

    );

  }

  if (coursesError) {

    return (

      <ErrorState

        message={getErrorMessage(coursesErr, 'Failed to load courses')}

        onRetry={() => refetchCourses()}

      />

    );

  }



  const onSubmit = (values: SemesterFormValues) => {

    updateMutation.mutate(

      {

        courseId: values.courseId,

        semesterNumber: values.semesterNumber,

        name: values.name,

        startDate: new Date(values.startDate).toISOString(),

        endDate: new Date(values.endDate).toISOString(),

        status: values.status,

      },

      {

        onSuccess: () => {

          router.push(`/dashboard/college-admin/semesters/${semesterId}`);

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

          { label: data.name, href: `/dashboard/college-admin/semesters/${data.id}` },

          { label: 'Edit' },

        ]}

      />

      <div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">

          Edit Semester

        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">Update semester details.</p>

      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <SemesterForm

          initialValues={data}

          courses={coursesData?.items ?? []}

          submitLabel="Save changes"

          loading={updateMutation.isPending}

          error={updateMutation.error}

          onSubmit={onSubmit}

        />

      </div>

    </div>

  );

}

