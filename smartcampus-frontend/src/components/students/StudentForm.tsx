'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { studentFormSchema, type StudentFormValues } from '@/utils/studentValidation';
import type { Course, Department, Semester, Student } from '@/types';
import { FormField, formInputClass } from '@/components/ui/FormField';
import { StudentAvatar, toDateInputValue } from '@/components/students/StudentBadges';
import { useUploadStudentImage } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { getErrorMessage } from '@/utils/cn';

interface StudentFormProps {
  initialValues?: Partial<Student>;
  departments: Department[];
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: StudentFormValues) => void;
}

export function StudentForm({
  initialValues,
  departments,
  submitLabel,
  loading,
  error,
  onSubmit,
}: StudentFormProps) {
  const uploadMutation = useUploadStudentImage();
  const [preview, setPreview] = useState(initialValues?.profileImage ?? '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      departmentId: initialValues?.departmentId ?? '',
      courseId: initialValues?.courseId ?? '',
      semesterId: initialValues?.semesterId ?? '',
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      gender: initialValues?.gender ?? 'OTHER',
      dateOfBirth: toDateInputValue(initialValues?.dateOfBirth),
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      address: initialValues?.address ?? '',
      city: initialValues?.city ?? '',
      state: initialValues?.state ?? '',
      country: initialValues?.country ?? '',
      pincode: initialValues?.pincode ?? '',
      bloodGroup: initialValues?.bloodGroup ?? 'UNKNOWN',
      admissionDate: toDateInputValue(initialValues?.admissionDate),
      rollNumber: initialValues?.rollNumber ?? '',
      registrationNumber: initialValues?.registrationNumber ?? '',
      profileImage: initialValues?.profileImage ?? '',
      status: initialValues?.status ?? 'ACTIVE',
      guardianName: initialValues?.guardianName ?? '',
      guardianPhone: initialValues?.guardianPhone ?? '',
      guardianEmail: initialValues?.guardianEmail ?? '',
    },
  });

  const departmentId = watch('departmentId');
  const courseId = watch('courseId');

  const { data: coursesData } = useCourses({
    page: 1,
    limit: 100,
    departmentId: departmentId || undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { data: semestersData } = useSemesters({
    page: 1,
    limit: 100,
    courseId: courseId || undefined,
    sortBy: 'semesterNumber',
    sortOrder: 'asc',
  });

  const courses: Course[] = useMemo(() => coursesData?.items ?? [], [coursesData]);
  const semesters: Semester[] = useMemo(() => semestersData?.items ?? [], [semestersData]);

  useEffect(() => {
    if (!departmentId) return;
    const currentCourse = courses.find((item) => item.id === courseId);
    if (courseId && currentCourse && currentCourse.departmentId !== departmentId) {
      setValue('courseId', '');
      setValue('semesterId', '');
    }
  }, [departmentId, courseId, courses, setValue]);

  useEffect(() => {
    if (!courseId) return;
    const currentSemester = semesters.find((item) => item.id === watch('semesterId'));
    if (currentSemester && currentSemester.courseId !== courseId) {
      setValue('semesterId', '');
    }
  }, [courseId, semesters, setValue, watch]);

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
          <StudentAvatar
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
            {uploadMutation.isPending ? (
              <p className="mt-1 text-xs text-teal-700">Uploading…</p>
            ) : null}
          </div>
        </div>
        <input type="hidden" {...register('profileImage')} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Academic information
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
          <FormField label="Course" error={errors.courseId?.message}>
            <select className={formInputClass} {...register('courseId')} disabled={!departmentId}>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Semester" error={errors.semesterId?.message}>
            <select className={formInputClass} {...register('semesterId')} disabled={!courseId}>
              <option value="">Select semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" error={errors.status?.message}>
            <select className={formInputClass} {...register('status')}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="GRADUATED">GRADUATED</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </FormField>
          <FormField
            label="Roll number"
            hint="Leave blank to auto-generate"
            error={errors.rollNumber?.message}
          >
            <input className={formInputClass} {...register('rollNumber')} />
          </FormField>
          <FormField
            label="Registration number"
            hint="Leave blank to auto-generate"
            error={errors.registrationNumber?.message}
          >
            <input className={formInputClass} {...register('registrationNumber')} />
          </FormField>
          <FormField label="Admission date" error={errors.admissionDate?.message}>
            <input type="date" className={formInputClass} {...register('admissionDate')} />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Personal information
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

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Guardian information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Guardian name" error={errors.guardianName?.message}>
            <input className={formInputClass} {...register('guardianName')} />
          </FormField>
          <FormField label="Guardian phone" error={errors.guardianPhone?.message}>
            <input className={formInputClass} {...register('guardianPhone')} />
          </FormField>
          <FormField label="Guardian email" error={errors.guardianEmail?.message}>
            <input type="email" className={formInputClass} {...register('guardianEmail')} />
          </FormField>
        </div>
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
