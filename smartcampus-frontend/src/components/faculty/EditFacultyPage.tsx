'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FacultyForm } from '@/components/faculty/FacultyForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { useFaculty, useUpdateFaculty } from '@/hooks/useFaculty';
import { useDepartments } from '@/hooks/useDepartments';
import type { FacultyFormValues } from '@/utils/facultyValidation';
import { getErrorMessage } from '@/utils/cn';
import { fullName } from '@/components/faculty/FacultyBadges';

interface EditFacultyPageProps {
  facultyId: string;
}

export function EditFacultyPage({ facultyId }: EditFacultyPageProps) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useFaculty(facultyId);
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isError: departmentsError,
    error: departmentsErr,
    refetch: refetchDepartments,
  } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const updateMutation = useUpdateFaculty(facultyId);

  if (isLoading || departmentsLoading) return <Loading label="Loading faculty..." />;
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load faculty')}
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

  const onSubmit = (values: FacultyFormValues) => {
    updateMutation.mutate(
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
        onSuccess: () => {
          toast.success('Faculty updated successfully');
          router.push(`/dashboard/college-admin/faculty/${facultyId}`);
        },
        onError: (updateError) => {
          toast.error(getErrorMessage(updateError, 'Failed to update faculty'));
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
          {
            label: fullName(data.firstName, data.lastName),
            href: `/dashboard/college-admin/faculty/${data.id}`,
          },
          { label: 'Edit' },
        ]}
      />
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Edit Faculty
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{data.facultyId}</p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <FacultyForm
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
