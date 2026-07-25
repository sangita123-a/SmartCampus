'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FacultyForm } from '@/components/faculty/FacultyForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { useCreateFaculty } from '@/hooks/useFaculty';
import { useDepartments } from '@/hooks/useDepartments';
import type { FacultyFormValues } from '@/utils/facultyValidation';
import { getErrorMessage } from '@/utils/cn';

export function AddFacultyPage() {
  const router = useRouter();
  const createMutation = useCreateFaculty();
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
        description="Faculty must belong to a department in your college."
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

  const onSubmit = (values: FacultyFormValues) => {
    createMutation.mutate(
      {
        departmentId: values.departmentId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth
          ? new Date(values.dateOfBirth).toISOString()
          : null,
        qualification: values.qualification || null,
        experience: values.experience,
        designation: values.designation,
        joiningDate: values.joiningDate
          ? new Date(values.joiningDate).toISOString()
          : undefined,
        employmentType: values.employmentType,
        salary: values.salary ? Number(values.salary) : null,
        bloodGroup: values.bloodGroup,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        pincode: values.pincode || null,
        profileImage: values.profileImage || null,
        status: values.status,
        employeeId: values.employeeId || undefined,
      },
      {
        onSuccess: (response) => {
          toast.success('Faculty created successfully');
          const id = response.data?.faculty.id;
          router.push(
            id ? `/dashboard/college-admin/faculty/${id}` : '/dashboard/college-admin/faculty'
          );
        },
        onError: (createError) => {
          toast.error(getErrorMessage(createError, 'Failed to create faculty'));
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard/college-admin' },
          { label: 'Faculty', href: '/dashboard/college-admin/faculty' },
          { label: 'Add' },
        ]}
      />
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Add Faculty
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Faculty ID and Employee ID auto-generate when left blank.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <FacultyForm
          departments={departments}
          submitLabel="Create faculty"
          loading={createMutation.isPending}
          error={createMutation.error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
