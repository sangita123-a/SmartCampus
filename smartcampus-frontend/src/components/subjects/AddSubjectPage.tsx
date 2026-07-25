'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SubjectForm } from '@/components/subjects/SubjectForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { useCreateSubject } from '@/hooks/useSubjects';
import { useDepartments } from '@/hooks/useDepartments';
import { useFacultyList } from '@/hooks/useFaculty';
import type { SubjectFormValues } from '@/utils/subjectValidation';
import { getErrorMessage } from '@/utils/cn';

export function AddSubjectPage() {
  const router = useRouter();
  const createMutation = useCreateSubject();
  const {
    data: departmentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc', status: 'ACTIVE' });
  const { data: facultyData, isLoading: facultyLoading } = useFacultyList({
    page: 1,
    limit: 100,
    status: 'ACTIVE',
    sortBy: 'firstName',
    sortOrder: 'asc',
  });

  if (isLoading || facultyLoading) return <Loading label="Loading form data..." />;
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
        description="Subjects must belong to a department, course, and semester."
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

  const onSubmit = (values: SubjectFormValues) => {
    createMutation.mutate(
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
        onSuccess: (response) => {
          toast.success('Subject created successfully');
          const id = response.data?.subject.id;
          router.push(
            id
              ? `/dashboard/college-admin/subjects/${id}`
              : '/dashboard/college-admin/subjects'
          );
        },
        onError: (createError) => {
          toast.error(getErrorMessage(createError, 'Failed to create subject'));
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
          { label: 'Add' },
        ]}
      />
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Add Subject
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Subject codes auto-generate as SUB0001, SUB0002… when left blank.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <SubjectForm
          departments={departments}
          facultyOptions={facultyData?.items ?? []}
          submitLabel="Create subject"
          loading={createMutation.isPending}
          error={createMutation.error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
