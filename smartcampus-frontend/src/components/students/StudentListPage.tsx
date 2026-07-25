'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useBulkDeleteStudents,
  useBulkStudentStatus,
  useDeleteStudent,
  useImportStudents,
  useStudents,
} from '@/hooks/useStudents';
import { useDepartments } from '@/hooks/useDepartments';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { studentService } from '@/services/student.service';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import {
  StudentAvatar,
  StudentStatusBadge,
  fullName,
} from '@/components/students/StudentBadges';
import type { Student, StudentStatus } from '@/types';
import { getErrorMessage } from '@/utils/cn';

type ConfirmAction =
  | { type: 'delete'; student: Student }
  | { type: 'bulk-delete' }
  | { type: 'bulk-status'; status: StudentStatus };

export function StudentListPage() {
  const importRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<StudentStatus | ''>('');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
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
      sortBy,
      sortOrder,
    }),
    [page, search, status, departmentId, courseId, semesterId, sortBy, sortOrder]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useStudents(params);
  const { data: departmentsData } = useDepartments({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });
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

  const deleteMutation = useDeleteStudent();
  const bulkDeleteMutation = useBulkDeleteStudents();
  const bulkStatusMutation = useBulkStudentStatus();
  const importMutation = useImportStudents();

  const actionLoading =
    deleteMutation.isPending ||
    bulkDeleteMutation.isPending ||
    bulkStatusMutation.isPending;

  const toggleSelected = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleAll = () => {
    if (!data) return;
    if (selected.length === data.items.length) {
      setSelected([]);
      return;
    }
    setSelected(data.items.map((item) => item.id));
  };

  const onConfirm = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === 'delete') {
        await deleteMutation.mutateAsync(confirm.student.id);
        toast.success('Student deleted');
      }
      if (confirm.type === 'bulk-delete') {
        await bulkDeleteMutation.mutateAsync(selected);
        toast.success('Selected students deleted');
        setSelected([]);
      }
      if (confirm.type === 'bulk-status') {
        await bulkStatusMutation.mutateAsync({ ids: selected, status: confirm.status });
        toast.success('Status updated for selected students');
        setSelected([]);
      }
      setConfirm(null);
    } catch (actionError) {
      toast.error(getErrorMessage(actionError, 'Action failed'));
    }
  };

  const downloadExport = async (format: 'csv' | 'xlsx') => {
    try {
      const blob = await studentService.exportFile(format, {
        search: search || undefined,
        status: status || undefined,
        departmentId: departmentId || undefined,
        courseId: courseId || undefined,
        semesterId: semesterId || undefined,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `students.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported students as ${format.toUpperCase()}`);
    } catch (exportError) {
      toast.error(getErrorMessage(exportError, 'Export failed'));
    }
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    try {
      const response = await importMutation.mutateAsync(file);
      const result = response.data?.result;
      toast.success(
        `Import finished: ${result?.created ?? 0} created, ${result?.failed ?? 0} failed`
      );
      if (result?.errors?.length) {
        toast.message(`${result.errors.length} row error(s)`, {
          description: result.errors
            .slice(0, 3)
            .map((item) => `Row ${item.row}: ${item.message}`)
            .join('\n'),
        });
      }
    } catch (importError) {
      toast.error(getErrorMessage(importError, 'Import failed'));
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  };

  const columns: Array<DataTableColumn<Student>> = [
    {
      key: 'select',
      header: 'Select',
      render: (row) => (
        <input
          type="checkbox"
          checked={selected.includes(row.id)}
          onChange={() => toggleSelected(row.id)}
          aria-label={`Select ${row.firstName}`}
        />
      ),
    },
    {
      key: 'photo',
      header: 'Photo',
      render: (row) => (
        <StudentAvatar
          src={row.profileImage}
          name={fullName(row.firstName, row.lastName)}
          size="sm"
        />
      ),
    },
    {
      key: 'studentId',
      header: 'Student ID',
      render: (row) => (
        <Link
          href={`/dashboard/college-admin/students/${row.id}`}
          className="font-semibold text-teal-800 hover:underline dark:text-teal-300"
        >
          {row.studentId}
        </Link>
      ),
    },
    {
      key: 'roll',
      header: 'Roll Number',
      render: (row) => row.rollNumber,
    },
    {
      key: 'name',
      header: 'Full Name',
      render: (row) => fullName(row.firstName, row.lastName),
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
      key: 'phone',
      header: 'Phone',
      render: (row) => row.phone,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => row.email,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StudentStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/college-admin/students/${row.id}`}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            View
          </Link>
          <Link
            href={`/dashboard/college-admin/students/${row.id}/edit`}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            className="text-xs font-semibold text-red-700 hover:underline"
            onClick={() => setConfirm({ type: 'delete', student: row })}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard/college-admin' },
          { label: 'Students' },
        ]}
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage student records for your college only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/college-admin/students/dashboard"
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
          >
            Student stats
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
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold"
          >
            {importMutation.isPending ? 'Importing…' : 'Import Excel'}
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(event) => void onImport(event.target.files?.[0])}
          />
          <Link
            href="/dashboard/college-admin/students/new"
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Add student
          </Link>
        </div>
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
              placeholder="Name, email, phone, student ID, roll no."
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
              setStatus(event.target.value as StudentStatus | '');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="GRADUATED">GRADUATED</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>

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
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
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
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {(semestersData?.items ?? []).map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>

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
              <option value="firstName">First name</option>
              <option value="lastName">Last name</option>
              <option value="studentId">Student ID</option>
              <option value="rollNumber">Roll number</option>
              <option value="admissionDate">Admission</option>
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

      {selected.length > 0 ? (
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
          <button
            type="button"
            className="text-xs font-semibold underline"
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <Loading label="Loading students..." />
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error, 'Failed to load students')}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Add students manually or import from Excel/CSV."
          action={
            <Link
              href="/dashboard/college-admin/students/new"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Add student
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.length === data.items.length}
                onChange={toggleAll}
              />
              Select page
            </label>
            <p>
              Showing page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              {isFetching ? ' · Refreshing…' : ''}
            </p>
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

      <ConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm?.type === 'delete' || confirm?.type === 'bulk-delete'
            ? 'Delete student(s)'
            : 'Update student status'
        }
        description={
          confirm?.type === 'delete'
            ? `Delete ${confirm.student.firstName} ${confirm.student.lastName}?`
            : confirm?.type === 'bulk-delete'
              ? `Delete ${selected.length} selected student(s)?`
              : `Update status to ${confirm?.status} for ${selected.length} student(s)?`
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
    </div>
  );
}
