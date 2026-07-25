'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseFormSchema, type CourseFormValues } from '@/utils/academicValidation';
import type { Course, Department } from '@/types';
import { FormField, formInputClass } from '@/components/ui/FormField';
import { getErrorMessage } from '@/utils/cn';

interface CourseFormProps {
  initialValues?: Partial<Course>;
  departments: Department[];
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: CourseFormValues) => void;
}

export function CourseForm({
  initialValues,
  departments,
  submitLabel,
  loading,
  error,
  onSubmit,
}: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      departmentId: initialValues?.departmentId ?? '',
      name: initialValues?.name ?? '',
      code: initialValues?.code ?? '',
      duration: initialValues?.duration ?? 8,
      courseType: initialValues?.courseType ?? 'UNDERGRADUATE',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'ACTIVE',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Department" error={errors.departmentId?.message}>
          <select className={formInputClass} {...register('departmentId')}>
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name} ({department.code})
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Course name" error={errors.name?.message}>
          <input className={formInputClass} {...register('name')} />
        </FormField>
        <FormField label="Course code" error={errors.code?.message}>
          <input className={formInputClass} placeholder="BTECH-CSE" {...register('code')} />
        </FormField>
        <FormField
          label="Duration"
          hint="Number of semester/year units"
          error={errors.duration?.message}
        >
          <input
            type="number"
            min={1}
            max={20}
            className={formInputClass}
            {...register('duration', { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Course type" error={errors.courseType?.message}>
          <select className={formInputClass} {...register('courseType')}>
            <option value="UNDERGRADUATE">UNDERGRADUATE</option>
            <option value="POSTGRADUATE">POSTGRADUATE</option>
            <option value="DIPLOMA">DIPLOMA</option>
            <option value="CERTIFICATE">CERTIFICATE</option>
            <option value="OTHER">OTHER</option>
          </select>
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
