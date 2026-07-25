'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StudentForm } from '@/components/students/StudentForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { useStudent, useUpdateStudent } from '@/hooks/useStudents';
import { useDepartments } from '@/hooks/useDepartments';
import type { StudentFormValues } from '@/utils/studentValidation';
import { getErrorMessage } from '@/utils/cn';
import { fullName } from '@/components/students/StudentBadges';

interface EditStudentPageProps {
  studentId: string;
}

export function EditStudentPage({ studentId }: EditStudentPageProps) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useStudent(studentId);
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isError: departmentsError,
    error: departmentsErr,
    refetch: refetchDepartments,
  } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const updateMutation = useUpdateStudent(studentId);

  if (isLoading || departmentsLoading) return <Loading label="Loading student..." />;
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load student')}
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

  const onSubmit = (values: StudentFormValues) => {
    updateMutation.mutate(
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
        onSuccess: () => {
          toast.success('Student updated successfully');
          router.push(`/dashboard/college-admin/students/${studentId}`);
        },
        onError: (updateError) => {
          toast.error(getErrorMessage(updateError, 'Failed to update student'));
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
          {
            label: fullName(data.firstName, data.lastName),
            href: `/dashboard/college-admin/students/${data.id}`,
          },
          { label: 'Edit' },
        ]}
      />
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Edit Student
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{data.studentId}</p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <StudentForm
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
