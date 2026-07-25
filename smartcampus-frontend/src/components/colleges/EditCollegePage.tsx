'use client';

import { useRouter } from 'next/navigation';
import { CollegeForm } from '@/components/colleges/CollegeForm';
import { useCollege, useUpdateCollege } from '@/hooks/useColleges';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import type { CollegeFormValues } from '@/utils/collegeValidation';
import { getErrorMessage } from '@/utils/cn';

interface EditCollegePageProps {
  collegeId: string;
}

export function EditCollegePage({ collegeId }: EditCollegePageProps) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useCollege(collegeId);
  const updateMutation = useUpdateCollege(collegeId);

  if (isLoading) return <Loading label="Loading college..." />;
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load college')}
        onRetry={() => refetch()}
      />
    );
  }

  const onSubmit = (values: CollegeFormValues) => {
    updateMutation.mutate(
      {
        name: values.name,
        code: values.code,
        email: values.email,
        phone: values.phone || null,
        address: values.address || null,
        website: values.website || null,
        logo: values.logo || null,
        status: values.status,
        subscriptionPlan: values.subscriptionPlan,
        subscriptionEnd: values.subscriptionEnd
          ? new Date(values.subscriptionEnd).toISOString()
          : null,
      },
      {
        onSuccess: () => router.push(`/dashboard/super-admin/colleges/${collegeId}`),
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Edit College
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Update tenant details and subscription.</p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <CollegeForm
          initialValues={data}
          submitLabel="Save changes"
          loading={updateMutation.isPending}
          error={updateMutation.error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
