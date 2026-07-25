'use client';



import Link from 'next/link';

import { useMemo, useState } from 'react';

import {

  useDeleteSemester,

  useSemesters,

  useToggleSemesterStatus,

} from '@/hooks/useSemesters';

import { useCourses } from '@/hooks/useCourses';

import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { Loading } from '@/components/Loading';

import { ErrorState } from '@/components/ErrorState';

import { EmptyState } from '@/components/EmptyState';

import { AcademicStatusBadge, formatDate } from '@/components/academic/AcademicBadges';

import type { AcademicStatus, Semester } from '@/types';

import { getErrorMessage } from '@/utils/cn';



type ActionTarget = { semester: Semester; action: 'toggle' | 'delete' };



export function SemesterListPage() {

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [searchInput, setSearchInput] = useState('');

  const [status, setStatus] = useState<AcademicStatus | ''>('');

  const [courseId, setCourseId] = useState('');

  const [sortBy, setSortBy] = useState('semesterNumber');

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [confirmTarget, setConfirmTarget] = useState<ActionTarget | null>(null);



  const params = useMemo(

    () => ({

      page,

      limit: 10,

      search: search || undefined,

      status: status || undefined,

      courseId: courseId || undefined,

      sortBy,

      sortOrder,

    }),

    [page, search, status, courseId, sortBy, sortOrder]

  );



  const { data, isLoading, isError, error, refetch, isFetching } = useSemesters(params);

  const { data: coursesData } = useCourses({

    page: 1,

    limit: 100,

    sortBy: 'name',

    sortOrder: 'asc',

  });

  const toggleMutation = useToggleSemesterStatus();

  const deleteMutation = useDeleteSemester();

  const actionLoading = toggleMutation.isPending || deleteMutation.isPending;



  const columns: Array<DataTableColumn<Semester>> = [

    {

      key: 'name',

      header: 'Semester',

      render: (row) => (

        <div>

          <Link

            href={`/dashboard/college-admin/semesters/${row.id}`}

            className="font-semibold text-teal-800 hover:underline dark:text-teal-300"

          >

            {row.name}

          </Link>

          <p className="text-xs text-[var(--muted)]">#{row.semesterNumber}</p>

        </div>

      ),

    },

    {

      key: 'course',

      header: 'Course',

      render: (row) => row.course?.name ?? '—',

    },

    {

      key: 'dates',

      header: 'Period',

      render: (row) => `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`,

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

            href={`/dashboard/college-admin/semesters/${row.id}/edit`}

            className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-300"

          >

            Edit

          </Link>

          <button

            type="button"

            className="text-xs font-semibold text-amber-700 hover:underline"

            onClick={() => setConfirmTarget({ semester: row, action: 'toggle' })}

          >

            {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}

          </button>

          <button

            type="button"

            className="text-xs font-semibold text-red-700 hover:underline"

            onClick={() => setConfirmTarget({ semester: row, action: 'delete' })}

          >

            Delete

          </button>

        </div>

      ),

    },

  ];



  const onConfirm = async () => {

    if (!confirmTarget) return;

    try {

      if (confirmTarget.action === 'toggle') {

        await toggleMutation.mutateAsync(confirmTarget.semester.id);

      } else {

        await deleteMutation.mutateAsync(confirmTarget.semester.id);

      }

      setConfirmTarget(null);

    } catch {

      // Keep dialog open on failure

    }

  };



  return (

    <div className="mx-auto max-w-6xl space-y-6">

      <Breadcrumb

        items={[

          { label: 'Dashboard', href: '/dashboard/college-admin' },

          { label: 'Semesters' },

        ]}

      />



      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">

            Semesters

          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">

            Manage academic terms for each course.

          </p>

        </div>

        <Link

          href="/dashboard/college-admin/semesters/new"

          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"

        >

          Add semester

        </Link>

      </div>



      <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 lg:grid-cols-5">

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

              placeholder="Semester name"

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

            Course

          </label>

          <select

            value={courseId}

            onChange={(event) => {

              setPage(1);

              setCourseId(event.target.value);

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

              <option value="semesterNumber">Number</option>

              <option value="name">Name</option>

              <option value="startDate">Start</option>

              <option value="endDate">End</option>

              <option value="status">Status</option>

            </select>

            <select

              value={sortOrder}

              onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}

              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"

            >

              <option value="asc">Asc</option>

              <option value="desc">Desc</option>

            </select>

          </div>

        </div>

      </div>



      {isLoading ? (

        <Loading label="Loading semesters..." />

      ) : isError ? (

        <ErrorState

          message={getErrorMessage(error, 'Failed to load semesters')}

          onRetry={() => refetch()}

        />

      ) : !data || data.items.length === 0 ? (

        <EmptyState

          title="No semesters yet"

          description="Create semesters for your courses to define academic terms."

          action={

            <Link

              href="/dashboard/college-admin/semesters/new"

              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"

            >

              Add semester

            </Link>

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



      <ConfirmDialog

        open={Boolean(confirmTarget)}

        title={confirmTarget?.action === 'delete' ? 'Delete semester' : 'Toggle semester status'}

        description={

          confirmTarget?.action === 'delete'

            ? `Delete ${confirmTarget.semester.name}?`

            : `Toggle status for ${confirmTarget?.semester.name}?`

        }

        confirmLabel={confirmTarget?.action === 'delete' ? 'Delete' : 'Confirm'}

        tone={confirmTarget?.action === 'delete' ? 'danger' : 'default'}

        loading={actionLoading}

        onCancel={() => setConfirmTarget(null)}

        onConfirm={() => void onConfirm()}

      />

    </div>

  );

}

