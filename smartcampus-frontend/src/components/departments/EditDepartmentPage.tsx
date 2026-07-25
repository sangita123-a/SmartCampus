'use client';



import { useRouter } from 'next/navigation';

import { DepartmentForm } from '@/components/departments/DepartmentForm';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { useDepartment, useUpdateDepartment } from '@/hooks/useDepartments';

import type { DepartmentFormValues } from '@/utils/academicValidation';

import { getErrorMessage } from '@/utils/cn';



interface EditDepartmentPageProps {

  departmentId: string;

}



export function EditDepartmentPage({ departmentId }: EditDepartmentPageProps) {

  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useDepartment(departmentId);

  const updateMutation = useUpdateDepartment(departmentId);



  if (isLoading) return <Loading label="Loading department..." />;

  if (isError || !data) {

    return (

      <ErrorState

        message={getErrorMessage(error, 'Failed to load department')}

        onRetry={() => refetch()}

      />

    );

  }



  const onSubmit = (values: DepartmentFormValues) => {

    updateMutation.mutate(

      {

        name: values.name,

        code: values.code,

        description: values.description || null,

        status: values.status,

      },

      {

        onSuccess: () => {

          router.push(`/dashboard/college-admin/departments/${departmentId}`);

        },

      }

    );

  };



  return (

    <div className="mx-auto max-w-3xl space-y-6">

      <Breadcrumb

        items={[

          { label: 'Dashboard', href: '/dashboard/college-admin' },

          { label: 'Departments', href: '/dashboard/college-admin/departments' },

          { label: data.name, href: `/dashboard/college-admin/departments/${data.id}` },

          { label: 'Edit' },

        ]}

      />

      <div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">

          Edit Department

        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">Update department details.</p>

      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <DepartmentForm

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

