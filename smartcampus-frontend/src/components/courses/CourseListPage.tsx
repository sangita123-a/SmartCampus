'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCourses, useDeleteCourse, useToggleCourseStatus } from '@/hooks/useCourses';
import { useDepartments } from '@/hooks/useDepartments';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import {
  AcademicStatusBadge,
  CourseTypeBadge,
} from '@/components/academic/AcademicBadges';
import type { AcademicStatus, Course, CourseType } from '@/types';
import { getErrorMessage } from '@/utils/cn';

type ActionTarget = { course: Course; action: 'toggle' | 'delete' };

export function CourseListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<AcademicStatus | ''>('');
  const [courseType, setCourseType] = useState<CourseType | ''>('');
  const [departmentId, setDepartmentId] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<ActionTarget | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: status || undefined,
      courseType: courseType || undefined,
      departmentId: departmentId || undefined,
    }),
    [page, search, status, courseType, departmentId]
  );

  const { data, isLoading, isError, error, refetch } = useCourses(params);
  const { data: departmentsData } = useDepartments({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const toggleMutation = useToggleCourseStatus();
  const deleteMutation = useDeleteCourse();
  const actionLoading = toggleMutation.isPending || deleteMutation.isPending;

  const columns: Array<DataTableColumn<Course>> = [
    {
      key: 'name',
      header: 'Course',
      render: (row) => (
        <div>
          <Link
            href={`/dashboard/college-admin/courses/${row.id}`}
            className="font-medium text-[var(--foreground)] hover:underline"
          >
            {row.name}
          </Link>
          <p className="font-mono text-xs text-[var(--muted)]">{row.code}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => (
        <span className="text-xs text-[var(--muted)]">
          {row.department?.name ?? '—'}
        </span>
      ),
    },
    {
      key: 'courseType',
      header: 'Type',
      render: (row) => <CourseTypeBadge type={row.courseType} />,
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (row) => <span className="text-xs text-[var(--muted)]">{row.duration} yrs</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <AcademicStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/college-admin/courses/${row.id}`}
            className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            View
          </Link>
          <Link
            href={`/dashboard/college-admin/courses/${row.id}/edit`}
            className="text-xs font-medium text-slate-600 hover:underline dark:text-slate-400"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmTarget({ course: row, action: 'toggle' })}
            className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400"
          >
            {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmTarget({ course: row, action: 'delete' })}
            className="text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleConfirmAction = () => {
    if (!confirmTarget) return;
    const { course, action } = confirmTarget;
    if (action === 'toggle') {
      toggleMutation.mutate(course.id, { onSuccess: () => setConfirmTarget(null) });
    } else {
      deleteMutation.mutate(course.id, { onSuccess: () => setConfirmTarget(null) });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard/college-admin' }, { label: 'Courses' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Courses
          </h1>
          <p className="text-xs text-[var(--muted)]">Manage degree programs and academic courses.</p>
        </div>
        <Link
          href="/dashboard/college-admin/courses/new"
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700"
        >
          Add Course
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search course name or code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearch(searchInput);
              setPage(1);
            }
          }}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <select
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Departments</option>
          {departmentsData?.items?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={courseType}
          onChange={(e) => {
            setCourseType(e.target.value as CourseType | '');
            setPage(1);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Course Types</option>
          <option value="UNDERGRADUATE">UNDERGRADUATE</option>
          <option value="POSTGRADUATE">POSTGRADUATE</option>
          <option value="DIPLOMA">DIPLOMA</option>
          <option value="CERTIFICATE">CERTIFICATE</option>
          <option value="OTHER">OTHER</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as AcademicStatus | '');
            setPage(1);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {isLoading ? (
        <Loading label="Loading courses..." />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Get started by creating a new academic course."
          action={
            <Link
              href="/dashboard/college-admin/courses/new"
              className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700"
            >
              Add Course
            </Link>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={data.items}
          rowKey={(row) => row.id}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          open={Boolean(confirmTarget)}
          title={
            confirmTarget.action === 'delete'
              ? 'Delete Course'
              : `${confirmTarget.course.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} Course`
          }
          description={
            confirmTarget.action === 'delete'
              ? `Are you sure you want to delete ${confirmTarget.course.name}? This action cannot be undone.`
              : `Change status of ${confirmTarget.course.name} to ${
                  confirmTarget.course.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                }?`
          }
          confirmLabel={confirmTarget.action === 'delete' ? 'Delete' : 'Confirm'}
          tone={confirmTarget.action === 'delete' ? 'danger' : 'default'}
          loading={actionLoading}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
