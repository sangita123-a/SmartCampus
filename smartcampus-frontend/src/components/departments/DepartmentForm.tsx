'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  departmentFormSchema,
  type DepartmentFormValues,
} from '@/utils/academicValidation';
import type { Department } from '@/types';
import { FormField, formInputClass } from '@/components/ui/FormField';
import { getErrorMessage } from '@/utils/cn';

interface DepartmentFormProps {
  initialValues?: Partial<Department>;
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: DepartmentFormValues) => void;
}

export function DepartmentForm({
  initialValues,
  submitLabel,
  loading,
  error,
  onSubmit,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      code: initialValues?.code ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'ACTIVE',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Department name" error={errors.name?.message}>
          <input className={formInputClass} {...register('name')} />
        </FormField>
        <FormField label="Department code" error={errors.code?.message}>
          <input className={formInputClass} placeholder="CSE" {...register('code')} />
        </FormField>
        <FormField label="Status" error={errors.status?.message}>
          <select className={formInputClass} {...register('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea className={formInputClass} rows={3} {...register('description')} />
      </FormField>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-200">
          {getErrorMessage(error, 'Request failed')}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-70"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
