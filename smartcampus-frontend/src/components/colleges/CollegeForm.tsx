'use client';

import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  collegeFormSchema,
  type CollegeFormValues,
} from '@/utils/collegeValidation';
import type { College } from '@/types';
import { getErrorMessage } from '@/utils/cn';

interface CollegeFormProps {
  initialValues?: Partial<College>;
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: CollegeFormValues) => void;
}

export function CollegeForm({
  initialValues,
  submitLabel,
  loading,
  error,
  onSubmit,
}: CollegeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeFormSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      code: initialValues?.code ?? '',
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      address: initialValues?.address ?? '',
      website: initialValues?.website ?? '',
      logo: initialValues?.logo ?? '',
      status: initialValues?.status ?? 'ACTIVE',
      subscriptionPlan: initialValues?.subscriptionPlan ?? 'FREE',
      subscriptionEnd: initialValues?.subscriptionEnd
        ? initialValues.subscriptionEnd.slice(0, 10)
        : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="College name" error={errors.name?.message}>
          <input className={inputClass} {...register('name')} />
        </Field>
        <Field label="College code" error={errors.code?.message}>
          <input className={inputClass} placeholder="MIT-01" {...register('code')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register('email')} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className={inputClass} {...register('phone')} />
        </Field>
        <Field label="Website" error={errors.website?.message}>
          <input className={inputClass} placeholder="https://" {...register('website')} />
        </Field>
        <Field label="Logo URL" error={errors.logo?.message}>
          <input className={inputClass} placeholder="https://" {...register('logo')} />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select className={inputClass} {...register('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </Field>
        <Field label="Subscription plan" error={errors.subscriptionPlan?.message}>
          <select className={inputClass} {...register('subscriptionPlan')}>
            <option value="FREE">FREE</option>
            <option value="BASIC">BASIC</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </Field>
        <Field label="Subscription end" error={errors.subscriptionEnd?.message}>
          <input type="date" className={inputClass} {...register('subscriptionEnd')} />
        </Field>
      </div>

      <Field label="Address" error={errors.address?.message}>
        <textarea className={cnTextarea} rows={3} {...register('address')} />
      </Field>

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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900';

const cnTextarea = inputClass;
