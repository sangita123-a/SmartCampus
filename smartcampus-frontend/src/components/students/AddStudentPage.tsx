'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StudentForm } from '@/components/students/StudentForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { useCreateStudent } from '@/hooks/useStudents';
import { useDepartments } from '@/hooks/useDepartments';
import type { StudentFormValues } from '@/utils/studentValidation';
import { getErrorMessage } from '@/utils/cn';

export function AddStudentPage() {
  const router = useRouter();
  const createMutation = useCreateStudent();
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
        title="Create academic structure first"
        description="Add a department, course, and semester before enrolling students."
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

  const onSubmit = (values: StudentFormValues) => {
    createMutation.mutate(
      {
        departmentId: values.departmentId,
        courseId: values.courseId,
        semesterId: values.semesterId,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        email: values.email,
        phone: values.phone,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        pincode: values.pincode || null,
        bloodGroup: values.bloodGroup,
        admissionDate: values.admissionDate
          ? new Date(values.admissionDate).toISOString()
          : undefined,
        rollNumber: values.rollNumber || undefined,
        registrationNumber: values.registrationNumber || undefined,
        profileImage: values.profileImage || null,
        status: values.status,
        guardianName: values.guardianName || null,
        guardianPhone: values.guardianPhone || null,
        guardianEmail: values.guardianEmail || null,
      },
      {
        onSuccess: (response) => {
          toast.success('Student created successfully');
          const id = response.data?.student.id;
          router.push(
            id
              ? `/dashboard/college-admin/students/${id}`
              : '/dashboard/college-admin/students'
          );
        },
        onError: (createError) => {
          toast.error(getErrorMessage(createError, 'Failed to create student'));
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard/college-admin' },
          { label: 'Students', href: '/dashboard/college-admin/students' },
          { label: 'Add' },
        ]}
      />
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Add Student
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Student ID, roll number, and registration number auto-generate when left blank.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <StudentForm
          departments={departments}
          submitLabel="Create student"
          loading={createMutation.isPending}
          error={createMutation.error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
