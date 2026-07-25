'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectFormSchema, type SubjectFormValues } from '@/utils/subjectValidation';
import type { Course, Department, Faculty, Semester, Subject } from '@/types';
import { FormField, formInputClass } from '@/components/ui/FormField';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { getErrorMessage } from '@/utils/cn';

interface SubjectFormProps {
  initialValues?: Partial<Subject>;
  departments: Department[];
  facultyOptions: Faculty[];
  submitLabel: string;
  loading?: boolean;
  error?: unknown;
  onSubmit: (values: SubjectFormValues) => void;
}

export function SubjectForm({
  initialValues,
  departments,
  facultyOptions,
  submitLabel,
  loading,
  error,
  onSubmit,
}: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      subjectName: initialValues?.subjectName ?? '',
      shortName: initialValues?.shortName ?? '',
      credits: initialValues?.credits ?? 1,
      theoryHours: initialValues?.theoryHours ?? 0,
      practicalHours: initialValues?.practicalHours ?? 0,
      departmentId: initialValues?.departmentId ?? '',
      courseId: initialValues?.courseId ?? '',
      semesterId: initialValues?.semesterId ?? '',
      facultyId: initialValues?.facultyId ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'ACTIVE',
      subjectCode: initialValues?.subjectCode ?? '',
    },
  });

  const departmentId = watch('departmentId');
  const courseId = watch('courseId');
  const theoryHours = watch('theoryHours');
  const practicalHours = watch('practicalHours');

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

  const filteredFaculty = useMemo(() => {
    if (!departmentId) return facultyOptions;
    return facultyOptions.filter((item) => item.departmentId === departmentId);
  }, [facultyOptions, departmentId]);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Academic placement
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
            </select>
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Subject details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Subject code"
            hint="Leave blank to auto-generate (SUB0001…)"
            error={errors.subjectCode?.message}
          >
            <input
              className={formInputClass}
              placeholder="SUB0001"
              {...register('subjectCode')}
            />
          </FormField>
          <FormField label="Subject name" error={errors.subjectName?.message}>
            <input className={formInputClass} {...register('subjectName')} />
          </FormField>
          <FormField label="Short name" error={errors.shortName?.message}>
            <input className={formInputClass} placeholder="Optional" {...register('shortName')} />
          </FormField>
          <FormField label="Credits" error={errors.credits?.message}>
            <input
              type="number"
              min={1}
              max={30}
              className={formInputClass}
              {...register('credits', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Theory hours" error={errors.theoryHours?.message}>
            <input
              type="number"
              min={0}
              max={200}
              className={formInputClass}
              {...register('theoryHours', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Practical hours" error={errors.practicalHours?.message}>
            <input
              type="number"
              min={0}
              max={200}
              className={formInputClass}
              {...register('practicalHours', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Total hours">
            <input
              className={formInputClass}
              value={(Number(theoryHours) || 0) + (Number(practicalHours) || 0)}
              readOnly
              disabled
            />
          </FormField>
          <FormField
            label="Assigned faculty"
            hint="Optional"
            error={errors.facultyId?.message}
          >
            <select className={formInputClass} {...register('facultyId')}>
              <option value="">Unassigned</option>
              {filteredFaculty.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.employeeId})
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Description" error={errors.description?.message}>
          <textarea className={formInputClass} rows={4} {...register('description')} />
        </FormField>
      </section>

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
