'use client';

import { useDepartments } from '@/hooks/useDepartments';
import { useCourses } from '@/hooks/useCourses';
import { Filter } from 'lucide-react';

interface Props {
  departmentId?: string;
  courseId?: string;
  onDepartmentChange: (id: string) => void;
  onCourseChange: (id: string) => void;
}

export function ReportFilterBar({ departmentId, courseId, onDepartmentChange, onCourseChange }: Props) {
  const { data: deptResponse } = useDepartments({ limit: 100 });
  const { data: courseResponse } = useCourses({ limit: 100 });

  const departments = deptResponse?.items || [];
  const courses = courseResponse?.items || [];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted)] shrink-0">
        <Filter className="h-4 w-4 text-teal-600" /> Filter Analytics:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <select
          value={departmentId || ''}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.code})
            </option>
          ))}
        </select>

        <select
          value={courseId || ''}
          onChange={(e) => onCourseChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
