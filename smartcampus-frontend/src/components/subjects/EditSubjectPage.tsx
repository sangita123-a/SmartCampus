'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SubjectForm } from '@/components/subjects/SubjectForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { useSubject, useUpdateSubject } from '@/hooks/useSubjects';
import { useDepartments } from '@/hooks/useDepartments';
import { useFacultyList } from '@/hooks/useFaculty';
import type { SubjectFormValues } from '@/utils/subjectValidation';
import { getErrorMessage } from '@/utils/cn';

interface EditSubjectPageProps {
  subjectId: string;
}

export function EditSubjectPage({ subjectId }: EditSubjectPageProps) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useSubject(subjectId);
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isError: departmentsError,
    error: departmentsErr,
    refetch: refetchDepartments,
  } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const { data: facultyData, isLoading: facultyLoading } = useFacultyList({
    page: 1,
    limit: 100,
    status: 'ACTIVE',
    sortBy: 'firstName',
    sortOrder: 'asc',
  });
  const updateMutation = useUpdateSubject(subjectId);

  if (isLoading || departmentsLoading || facultyLoading) {
    return <Loading label="Loading subject..." />;
  }
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load subject')}
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

  const onSubmit = (values: SubjectFormValues) => {
    updateMutation.mutate(
      {
        subjectName: values.subjectName,
        shortName: values.shortName || null,
        credits: values.credits,
        theoryHours: values.theoryHours,
        practicalHours: values.practicalHours,
        departmentId: values.departmentId,
        courseId: values.courseId,
        semesterId: values.semesterId,
        facultyId: values.facultyId || null,
        description: values.description || null,
        status: values.status,
        subjectCode: values.subjectCode || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Subject updated successfully');
          router.push(`/dashboard/college-admin/subjects/${subjectId}`);
        },
        onError: (updateError) => {
          toast.error(getErrorMessage(updateError, 'Failed to update subject'));
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard/college-admin' },
          { label: 'Subjects', href: '/dashboard/college-admin/subjects' },
          {
            label: data.subjectName,
            href: `/dashboard/college-admin/subjects/${data.id}`,
          },
          { label: 'Edit' },
        ]}
      />
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Edit Subject
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{data.subjectCode}</p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <SubjectForm
          initialValues={data}
          departments={departmentsData?.items ?? []}
          facultyOptions={facultyData?.items ?? []}
          submitLabel="Save changes"
          loading={updateMutation.isPending}
          error={updateMutation.error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
