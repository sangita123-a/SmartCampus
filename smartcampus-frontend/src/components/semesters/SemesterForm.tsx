'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterFormSchema, type SemesterFormValues } from '@/utils/academicValidation';
import type { Course, Semester } from '@/types';
import { FormField, formInputClass } from '@/components/ui/FormField';
import { toDateInputValue } from '@/components/academic/AcademicBadges';
import { getErrorMessage } from '@/utils/cn';

interface SemesterFormProps {
  initialValues?: Partial<Semester>;
  courses: Course[];
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: SemesterFormValues) => void;
}

export function SemesterForm({
  initialValues,
  courses,
  submitLabel,
  loading,
  error,
  onSubmit,
}: SemesterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterFormSchema),
    defaultValues: {
      courseId: initialValues?.courseId ?? '',
      semesterNumber: initialValues?.semesterNumber ?? 1,
      name: initialValues?.name ?? '',
      startDate: toDateInputValue(initialValues?.startDate),
      endDate: toDateInputValue(initialValues?.endDate),
      status: initialValues?.status ?? 'ACTIVE',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Course" error={errors.courseId?.message}>
          <select className={formInputClass} {...register('courseId')}>
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Semester number" error={errors.semesterNumber?.message}>
          <input
            type="number"
            min={1}
            max={20}
            className={formInputClass}
            {...register('semesterNumber', { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Semester name" error={errors.name?.message}>
          <input
            className={formInputClass}
            placeholder="Semester 1"
            {...register('name')}
          />
        </FormField>
        <FormField label="Status" error={errors.status?.message}>
          <select className={formInputClass} {...register('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </FormField>
        <FormField label="Start date" error={errors.startDate?.message}>
          <input type="date" className={formInputClass} {...register('startDate')} />
        </FormField>
        <FormField label="End date" error={errors.endDate?.message}>
          <input type="date" className={formInputClass} {...register('endDate')} />
        </FormField>
      </div>

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
