'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  useAssignFaculty,
  useDeleteSubject,
  useRemoveSubjectFaculty,
  useSubject,
} from '@/hooks/useSubjects';
import { useFacultyList } from '@/hooks/useFaculty';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { AcademicStatusBadge } from '@/components/academic/AcademicBadges';
import { getErrorMessage } from '@/utils/cn';

interface SubjectDetailsPageProps {
  subjectId: string;
  basePath?: string;
  showAdminActions?: boolean;
}

export function SubjectDetailsPage({
  subjectId,
  basePath = '/dashboard/college-admin/subjects',
  showAdminActions = true,
}: SubjectDetailsPageProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [facultyId, setFacultyId] = useState('');
  const { data, isLoading, isError, error, refetch } = useSubject(subjectId);
  const deleteMutation = useDeleteSubject();
  const assignMutation = useAssignFaculty();
  const removeFacultyMutation = useRemoveSubjectFaculty();

  const { data: facultyData } = useFacultyList(
    {
      page: 1,
      limit: 100,
      status: 'ACTIVE',
      departmentId: data?.departmentId,
      sortBy: 'firstName',
      sortOrder: 'asc',
    },
    showAdminActions && Boolean(data?.departmentId)
  );

  if (isLoading) return <Loading label="Loading subject details..." />;
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load subject')}
        onRetry={() => refetch()}
      />
    );
  }

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync(data.id);
      toast.success('Subject deleted');
      router.push(basePath);
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, 'Delete failed'));
    }
  };

  const onAssign = async () => {
    if (!facultyId) {
      toast.error('Select a faculty member');
      return;
    }
    try {
      await assignMutation.mutateAsync({ id: data.id, facultyId });
      toast.success('Faculty assigned');
      setFacultyId('');
    } catch (assignError) {
      toast.error(getErrorMessage(assignError, 'Assignment failed'));
    }
  };

  const onRemoveFaculty = async () => {
    try {
      await removeFacultyMutation.mutateAsync(data.id);
      toast.success('Faculty removed');
    } catch (removeError) {
      toast.error(getErrorMessage(removeError, 'Remove failed'));
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {showAdminActions ? (
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard/college-admin' },
            { label: 'Subjects', href: basePath },
            { label: data.subjectName },
          ]}
        />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            {data.subjectName}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {data.subjectCode}
            {data.shortName ? ` · ${data.shortName}` : ''}
          </p>
          <div className="mt-2">
            <AcademicStatusBadge status={data.status} />
          </div>
        </div>
        {showAdminActions ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={basePath}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"
            >
              Back
            </Link>
            <Link
              href={`${basePath}/${data.id}/edit`}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            href={basePath}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            Back
          </Link>
        )}
      </div>

      <Section title="Basic Information">
        <Detail label="Subject code" value={data.subjectCode} />
        <Detail label="Subject name" value={data.subjectName} />
        <Detail label="Short name" value={data.shortName} />
        <Detail label="Credits" value={String(data.credits)} />
        <Detail label="Status" value={data.status} />
        <Detail label="College" value={data.college?.name} />
      </Section>

      <Section title="Academic Structure">
        <Detail label="Department" value={data.department?.name} />
        <Detail label="Course" value={data.course?.name} />
        <Detail label="Semester" value={data.semester?.name} />
        <Detail label="Theory hours" value={String(data.theoryHours)} />
        <Detail label="Practical hours" value={String(data.practicalHours)} />
        <Detail label="Total hours" value={String(data.totalHours)} />
      </Section>

      <Section title="Assigned Faculty">
        <Detail
          label="Faculty"
          value={
            data.faculty
              ? `${data.faculty.firstName} ${data.faculty.lastName} (${data.faculty.employeeId})`
              : 'Unassigned'
          }
        />
        <Detail label="Faculty ID" value={data.faculty?.facultyId} />
      </Section>

      <Section title="Description">
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Description</dt>
          <dd className="mt-1 whitespace-pre-wrap font-semibold text-[var(--foreground)]">
            {data.description || '—'}
          </dd>
        </div>
      </Section>

      {showAdminActions ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            Assign Faculty
          </h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Faculty member
              </span>
              <select
                value={facultyId}
                onChange={(event) => setFacultyId(event.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              >
                <option value="">Select faculty</option>
                {(facultyData?.items ?? []).map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} ({member.employeeId})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => void onAssign()}
              disabled={assignMutation.isPending}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {assignMutation.isPending ? 'Assigning…' : 'Assign'}
            </button>
            {data.facultyId ? (
              <button
                type="button"
                onClick={() => void onRemoveFaculty()}
                disabled={removeFacultyMutation.isPending}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-70"
              >
                {removeFacultyMutation.isPending ? 'Removing…' : 'Remove faculty'}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {showAdminActions ? (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete subject"
          description={`Delete ${data.subjectName}? This cannot be undone.`}
          confirmLabel="Delete"
          tone="danger"
          loading={deleteMutation.isPending}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => void onDelete()}
        />
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        {title}
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-[var(--foreground)]">{value || '—'}</dd>
    </div>
  );
}
