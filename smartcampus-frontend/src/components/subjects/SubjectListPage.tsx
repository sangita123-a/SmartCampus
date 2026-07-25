'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useBulkDeleteSubjects,
  useBulkSubjectStatus,
  useDeleteSubject,
  useSubjects,
} from '@/hooks/useSubjects';
import { useDepartments } from '@/hooks/useDepartments';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { subjectService } from '@/services/subject.service';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { AcademicStatusBadge } from '@/components/academic/AcademicBadges';
import type { AcademicStatus, Subject } from '@/types';
import { getErrorMessage } from '@/utils/cn';

type ConfirmAction =
  | { type: 'delete'; subject: Subject }
  | { type: 'bulk-delete' }
  | { type: 'bulk-status'; status: AcademicStatus };

interface SubjectListPageProps {
  basePath?: string;
  showAdminActions?: boolean;
  showAcademicFilters?: boolean;
  title?: string;
  description?: string;
}

export function SubjectListPage({
  basePath = '/dashboard/college-admin/subjects',
  showAdminActions = true,
  showAcademicFilters = true,
  title = 'Subjects',
  description = 'Manage subjects for your college only.',
}: SubjectListPageProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<AcademicStatus | ''>('');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [assignment, setAssignment] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: status || undefined,
      departmentId: departmentId || undefined,
      courseId: courseId || undefined,
      semesterId: semesterId || undefined,
      assignment: showAdminActions ? assignment : undefined,
      sortBy,
      sortOrder,
    }),
    [
      page,
      search,
      status,
      departmentId,
      courseId,
      semesterId,
      assignment,
      sortBy,
      sortOrder,
      showAdminActions,
    ]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useSubjects(params);
  const { data: departmentsData } = useDepartments(
    {
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'asc',
    },
    showAcademicFilters
  );
  const { data: coursesData } = useCourses(
    {
      page: 1,
      limit: 100,
      departmentId: departmentId || undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    },
    showAcademicFilters
  );
  const { data: semestersData } = useSemesters(
    {
      page: 1,
      limit: 100,
      courseId: courseId || undefined,
      sortBy: 'semesterNumber',
      sortOrder: 'asc',
    },
    showAcademicFilters
  );

  const deleteMutation = useDeleteSubject();
  const bulkDeleteMutation = useBulkDeleteSubjects();
  const bulkStatusMutation = useBulkSubjectStatus();
  const actionLoading =
    deleteMutation.isPending ||
    bulkDeleteMutation.isPending ||
    bulkStatusMutation.isPending;

  const toggleSelected = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const onConfirm = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === 'delete') {
        await deleteMutation.mutateAsync(confirm.subject.id);
        toast.success('Subject deleted');
      }
      if (confirm.type === 'bulk-delete') {
        await bulkDeleteMutation.mutateAsync(selected);
        toast.success('Selected subjects deleted');
        setSelected([]);
      }
      if (confirm.type === 'bulk-status') {
        await bulkStatusMutation.mutateAsync({ ids: selected, status: confirm.status });
        toast.success('Status updated');
        setSelected([]);
      }
      setConfirm(null);
    } catch (actionError) {
      toast.error(getErrorMessage(actionError, 'Action failed'));
    }
  };

  const downloadExport = async (format: 'csv' | 'xlsx') => {
    try {
      const blob = await subjectService.exportFile(format, {
        search: search || undefined,
        status: status || undefined,
        departmentId: departmentId || undefined,
        courseId: courseId || undefined,
        semesterId: semesterId || undefined,
        assignment: assignment === 'all' ? undefined : assignment,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `subjects.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (exportError) {
      toast.error(getErrorMessage(exportError, 'Export failed'));
    }
  };

  const facultyLabel = (row: Subject) =>
    row.faculty
      ? `${row.faculty.firstName} ${row.faculty.lastName}`
      : 'Unassigned';

  const columns: Array<DataTableColumn<Subject>> = [
    ...(showAdminActions
      ? [
          {
            key: 'select',
            header: 'Select',
            render: (row: Subject) => (
              <input
                type="checkbox"
                checked={selected.includes(row.id)}
                onChange={() => toggleSelected(row.id)}
                aria-label={`Select ${row.subjectName}`}
              />
            ),
          } satisfies DataTableColumn<Subject>,
        ]
      : []),
    {
      key: 'subjectCode',
      header: 'Subject Code',
      render: (row) => (
        <Link
          href={`${basePath}/${row.id}`}
          className="font-semibold text-teal-800 hover:underline dark:text-teal-300"
        >
          {row.subjectCode}
        </Link>
      ),
    },
    {
      key: 'subjectName',
      header: 'Subject Name',
      render: (row) => row.subjectName,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => row.department?.name ?? '—',
    },
    {
      key: 'course',
      header: 'Course',
      render: (row) => row.course?.name ?? '—',
    },
    {
      key: 'semester',
      header: 'Semester',
      render: (row) => row.semester?.name ?? '—',
    },
    {
      key: 'faculty',
      header: 'Faculty',
      render: (row) => facultyLabel(row),
    },
    {
      key: 'credits',
      header: 'Credits',
      render: (row) => row.credits,
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
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${basePath}/${row.id}`}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            View
          </Link>
          {showAdminActions ? (
            <>
              <Link
                href={`${basePath}/${row.id}/edit`}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Edit
              </Link>
              <button
                type="button"
                className="text-xs font-semibold text-red-700 hover:underline"
                onClick={() => setConfirm({ type: 'delete', subject: row })}
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {showAdminActions ? (
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard/college-admin' },
            { label: 'Subjects' },
          ]}
        />
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
        </div>
        {showAdminActions ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${basePath}/dashboard`}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              Subject stats
            </Link>
            <button
              type="button"
              onClick={() => void downloadExport('csv')}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => void downloadExport('xlsx')}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              Export Excel
            </button>
            <Link
              href={`${basePath}/new`}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Add subject
            </Link>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 xl:grid-cols-4">
        <form
          className="sm:col-span-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setSearch(searchInput.trim());
          }}
        >
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Search
          </label>
          <div className="flex gap-2">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Code, name, short name"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-teal-600"
            />
            <button
              type="submit"
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              Go
            </button>
          </div>
        </form>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Status
          </label>
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as AcademicStatus | '');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {showAdminActions ? (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Assignment
            </label>
            <select
              value={assignment}
              onChange={(event) => {
                setPage(1);
                setAssignment(event.target.value as 'all' | 'assigned' | 'unassigned');
              }}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        ) : null}

        {showAcademicFilters ? (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Department
              </label>
              <select
                value={departmentId}
                onChange={(event) => {
                  setPage(1);
                  setDepartmentId(event.target.value);
                  setCourseId('');
                  setSemesterId('');
                }}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              >
                <option value="">All</option>
                {(departmentsData?.items ?? []).map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Course
              </label>
              <select
                value={courseId}
                onChange={(event) => {
                  setPage(1);
                  setCourseId(event.target.value);
                  setSemesterId('');
                }}
                disabled={!departmentId && showAdminActions}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm disabled:opacity-60"
              >
                <option value="">All</option>
                {(coursesData?.items ?? []).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Semester
              </label>
              <select
                value={semesterId}
                onChange={(event) => {
                  setPage(1);
                  setSemesterId(event.target.value);
                }}
                disabled={!courseId && showAdminActions}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm disabled:opacity-60"
              >
                <option value="">All</option>
                {(semestersData?.items ?? []).map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Sort
          </label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="createdAt">Created</option>
              <option value="subjectCode">Code</option>
              <option value="subjectName">Name</option>
              <option value="credits">Credits</option>
              <option value="totalHours">Hours</option>
              <option value="status">Status</option>
            </select>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {showAdminActions && selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm dark:border-teal-900 dark:bg-teal-950">
          <span className="font-semibold">{selected.length} selected</span>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold"
            onClick={() => setConfirm({ type: 'bulk-status', status: 'ACTIVE' })}
          >
            Mark Active
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold"
            onClick={() => setConfirm({ type: 'bulk-status', status: 'INACTIVE' })}
          >
            Mark Inactive
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white"
            onClick={() => setConfirm({ type: 'bulk-delete' })}
          >
            Bulk Delete
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <Loading label="Loading subjects..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load subjects')}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No subjects yet"
          description={
            showAdminActions
              ? 'Create a subject linked to department, course, and semester.'
              : 'No subjects are available for your account.'
          }
          action={
            showAdminActions ? (
              <Link
                href={`${basePath}/new`}
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Add subject
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="text-xs text-[var(--muted)]">
            Showing page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
            {isFetching ? ' · Refreshing…' : ''}
          </div>
          <DataTable columns={columns} rows={data.items} rowKey={(row) => row.id} />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showAdminActions ? (
        <ConfirmDialog
          open={Boolean(confirm)}
          title={
            confirm?.type === 'delete' || confirm?.type === 'bulk-delete'
              ? 'Delete subject'
              : 'Update subject status'
          }
          description={
            confirm?.type === 'delete'
              ? `Delete ${confirm.subject.subjectName}?`
              : confirm?.type === 'bulk-delete'
                ? `Delete ${selected.length} selected subject(s)?`
                : `Update status to ${confirm?.status} for ${selected.length} subject(s)?`
          }
          confirmLabel={
            confirm?.type === 'delete' || confirm?.type === 'bulk-delete' ? 'Delete' : 'Update'
          }
          tone={
            confirm?.type === 'delete' || confirm?.type === 'bulk-delete' ? 'danger' : 'default'
          }
          loading={actionLoading}
          onCancel={() => setConfirm(null)}
          onConfirm={() => void onConfirm()}
        />
      ) : null}
    </div>
  );
}
