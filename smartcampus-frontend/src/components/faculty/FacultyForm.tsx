'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { facultyFormSchema, type FacultyFormValues } from '@/utils/facultyValidation';
import type { Department, Faculty } from '@/types';
import { FormField, formInputClass } from '@/components/ui/FormField';
import { FacultyAvatar, toDateInputValue } from '@/components/faculty/FacultyBadges';
import { useUploadFacultyImage } from '@/hooks/useFaculty';
import { getErrorMessage } from '@/utils/cn';

interface FacultyFormProps {
  initialValues?: Partial<Faculty>;
  departments: Department[];
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: FacultyFormValues) => void;
}

export function FacultyForm({
  initialValues,
  departments,
  submitLabel,
  loading,
  error,
  onSubmit,
}: FacultyFormProps) {
  const uploadMutation = useUploadFacultyImage();
  const [preview, setPreview] = useState(initialValues?.profileImage ?? '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FacultyFormValues>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues: {
      departmentId: initialValues?.departmentId ?? '',
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      gender: initialValues?.gender ?? 'OTHER',
      dateOfBirth: toDateInputValue(initialValues?.dateOfBirth),
      qualification: initialValues?.qualification ?? '',
      experience: initialValues?.experience ?? 0,
      designation: initialValues?.designation ?? '',
      joiningDate: toDateInputValue(initialValues?.joiningDate),
      employmentType: initialValues?.employmentType ?? 'FULL_TIME',
      salary: initialValues?.salary ?? '',
      bloodGroup: initialValues?.bloodGroup ?? 'UNKNOWN',
      address: initialValues?.address ?? '',
      city: initialValues?.city ?? '',
      state: initialValues?.state ?? '',
      country: initialValues?.country ?? '',
      pincode: initialValues?.pincode ?? '',
      profileImage: initialValues?.profileImage ?? '',
      status: initialValues?.status ?? 'ACTIVE',
      employeeId: initialValues?.employeeId ?? '',
    },
  });

  const onFileChange = async (file?: File) => {
    if (!file) return;
    try {
      const response = await uploadMutation.mutateAsync(file);
      const url = response.data?.url;
      if (!url) throw new Error('Upload failed');
      setValue('profileImage', url);
      setPreview(url);
      toast.success('Profile image uploaded');
    } catch (uploadError) {
      toast.error(getErrorMessage(uploadError, 'Image upload failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Profile photo
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <FacultyAvatar
            src={preview}
            name={`${watch('firstName')} ${watch('lastName')}`}
            size="lg"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void onFileChange(event.target.files?.[0])}
              className="block w-full text-sm text-[var(--muted)]"
            />
            <p className="mt-1 text-xs text-[var(--muted)]">
              JPG/PNG up to 5MB. Stored via Cloudinary.
            </p>
          </div>
        </div>
        <input type="hidden" {...register('profileImage')} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Professional details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Department" error={errors.departmentId?.message}>
            <select className={formInputClass} {...register('departmentId')}>
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Designation" error={errors.designation?.message}>
            <input
              className={formInputClass}
              placeholder="Assistant Professor"
              {...register('designation')}
            />
          </FormField>
          <FormField label="Employment type" error={errors.employmentType?.message}>
            <select className={formInputClass} {...register('employmentType')}>
              <option value="FULL_TIME">FULL TIME</option>
              <option value="PART_TIME">PART TIME</option>
              <option value="CONTRACT">CONTRACT</option>
              <option value="VISITING">VISITING</option>
            </select>
          </FormField>
          <FormField label="Experience (years)" error={errors.experience?.message}>
            <input
              type="number"
              min={0}
              max={60}
              className={formInputClass}
              {...register('experience', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Qualification" error={errors.qualification?.message}>
            <input className={formInputClass} {...register('qualification')} />
          </FormField>
          <FormField label="Joining date" error={errors.joiningDate?.message}>
            <input type="date" className={formInputClass} {...register('joiningDate')} />
          </FormField>
          <FormField
            label="Employee ID"
            hint="Leave blank to auto-generate"
            error={errors.employeeId?.message}
          >
            <input className={formInputClass} {...register('employeeId')} />
          </FormField>
          <FormField label="Salary" error={errors.salary?.message}>
            <input type="number" min={0} className={formInputClass} {...register('salary')} />
          </FormField>
          <FormField label="Status" error={errors.status?.message}>
            <select className={formInputClass} {...register('status')}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ON_LEAVE">ON LEAVE</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Personal details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" error={errors.firstName?.message}>
            <input className={formInputClass} {...register('firstName')} />
          </FormField>
          <FormField label="Last name" error={errors.lastName?.message}>
            <input className={formInputClass} {...register('lastName')} />
          </FormField>
          <FormField label="Gender" error={errors.gender?.message}>
            <select className={formInputClass} {...register('gender')}>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
              <option value="PREFER_NOT_TO_SAY">PREFER NOT TO SAY</option>
            </select>
          </FormField>
          <FormField label="Date of birth" error={errors.dateOfBirth?.message}>
            <input type="date" className={formInputClass} {...register('dateOfBirth')} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" className={formInputClass} {...register('email')} />
          </FormField>
          <FormField label="Phone" error={errors.phone?.message}>
            <input className={formInputClass} {...register('phone')} />
          </FormField>
          <FormField label="Blood group" error={errors.bloodGroup?.message}>
            <select className={formInputClass} {...register('bloodGroup')}>
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="A_POS">A+</option>
              <option value="A_NEG">A-</option>
              <option value="B_POS">B+</option>
              <option value="B_NEG">B-</option>
              <option value="AB_POS">AB+</option>
              <option value="AB_NEG">AB-</option>
              <option value="O_POS">O+</option>
              <option value="O_NEG">O-</option>
            </select>
          </FormField>
          <FormField label="City" error={errors.city?.message}>
            <input className={formInputClass} {...register('city')} />
          </FormField>
          <FormField label="State" error={errors.state?.message}>
            <input className={formInputClass} {...register('state')} />
          </FormField>
          <FormField label="Country" error={errors.country?.message}>
            <input className={formInputClass} {...register('country')} />
          </FormField>
          <FormField label="Pincode" error={errors.pincode?.message}>
            <input className={formInputClass} {...register('pincode')} />
          </FormField>
        </div>
        <FormField label="Address" error={errors.address?.message}>
          <textarea className={formInputClass} rows={3} {...register('address')} />
        </FormField>
      </section>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-200">
          {getErrorMessage(error, 'Request failed')}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || uploadMutation.isPending}
        className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-70"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
