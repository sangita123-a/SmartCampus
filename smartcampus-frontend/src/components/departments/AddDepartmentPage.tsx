'use client';



import { useRouter } from 'next/navigation';

import { DepartmentForm } from '@/components/departments/DepartmentForm';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { useCreateDepartment } from '@/hooks/useDepartments';

import type { DepartmentFormValues } from '@/utils/academicValidation';



export function AddDepartmentPage() {

  const router = useRouter();

  const createMutation = useCreateDepartment();



  const onSubmit = (values: DepartmentFormValues) => {

    createMutation.mutate(

      {

        name: values.name,

        code: values.code,

        description: values.description || null,

        status: values.status,

      },

      {

        onSuccess: (response) => {

          const id = response.data?.department.id;

          router.push(

            id

              ? `/dashboard/college-admin/departments/${id}`

              : '/dashboard/college-admin/departments'

          );

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

          { label: 'Add' },

        ]}

      />

      <div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">

          Add Department

        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">

          Create a department scoped to your college.

        </p>

      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">

        <DepartmentForm

          submitLabel="Create department"

          loading={createMutation.isPending}

          error={createMutation.error}

          onSubmit={onSubmit}

        />

      </div>

    </div>

  );

}

