'use client';

import { useRouter } from 'next/navigation';
import { CollegeForm } from '@/components/colleges/CollegeForm';
import { useCreateCollege } from '@/hooks/useColleges';
import type { CollegeFormValues } from '@/utils/collegeValidation';

export function AddCollegePage() {
  const router = useRouter();
  const createMutation = useCreateCollege();

  const onSubmit = (values: CollegeFormValues) => {
    createMutation.mutate(
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
        onSuccess: (response) => {
          const id = response.data?.college.id;
          router.push(id ? `/dashboard/super-admin/colleges/${id}` : '/dashboard/super-admin/colleges');
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          Add College
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Create a new tenant college with subscription plan.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <CollegeForm
          submitLabel="Create college"
          loading={createMutation.isPending}
          error={createMutation.error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
