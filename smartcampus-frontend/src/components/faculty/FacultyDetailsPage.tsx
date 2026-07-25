'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useDeleteFaculty, useFaculty } from '@/hooks/useFaculty';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import {
  FacultyAvatar,
  FacultyStatusBadge,
  formatDate,
  fullName,
} from '@/components/faculty/FacultyBadges';
import { getErrorMessage } from '@/utils/cn';

interface FacultyDetailsPageProps {
  facultyId: string;
  showAdminActions?: boolean;
}

export function FacultyDetailsPage({
  facultyId,
  showAdminActions = true,
}: FacultyDetailsPageProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useFaculty(facultyId);
  const deleteMutation = useDeleteFaculty();

  if (isLoading) return <Loading label="Loading faculty details..." />;
  if (isError || !data) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load faculty')}
        onRetry={() => refetch()}
      />
    );
  }

  const name = fullName(data.firstName, data.lastName);

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync(data.id);
      toast.success('Faculty deleted');
      router.push('/dashboard/college-admin/faculty');
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, 'Delete failed'));
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {showAdminActions ? (
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard/college-admin' },
            { label: 'Faculty', href: '/dashboard/college-admin/faculty' },
            { label: name },
          ]}
        />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <FacultyAvatar src={data.profileImage} name={name} size="lg" />
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
              {name}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {data.facultyId} · {data.employeeId}
            </p>
            <div className="mt-2">
              <FacultyStatusBadge status={data.status} />
            </div>
          </div>
        </div>
        {showAdminActions ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/college-admin/faculty"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"
            >
              Back
            </Link>
            <Link
              href={`/dashboard/college-admin/faculty/${data.id}/edit`}
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
        ) : null}
      </div>

      <Section title="Personal Details">
        <Detail label="Email" value={data.email} />
        <Detail label="Phone" value={data.phone} />
        <Detail label="Gender" value={data.gender} />
        <Detail label="Date of birth" value={formatDate(data.dateOfBirth)} />
        <Detail label="Blood group" value={data.bloodGroup.replace('_', ' ')} />
        <Detail label="Address" value={data.address} />
        <Detail label="City" value={data.city} />
        <Detail label="State" value={data.state} />
        <Detail label="Country" value={data.country} />
        <Detail label="Pincode" value={data.pincode} />
      </Section>

      <Section title="Professional Details">
        <Detail label="Department" value={data.department?.name} />
        <Detail label="Designation" value={data.designation} />
        <Detail label="Qualification" value={data.qualification} />
        <Detail label="Experience" value={`${data.experience} years`} />
        <Detail label="Employment type" value={data.employmentType.replace('_', ' ')} />
        <Detail label="Joining date" value={formatDate(data.joiningDate)} />
        <Detail label="Salary" value={data.salary} />
        <Detail label="Status" value={data.status} />
      </Section>

      {showAdminActions ? (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete faculty"
          description={`Delete ${name}? This cannot be undone.`}
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
