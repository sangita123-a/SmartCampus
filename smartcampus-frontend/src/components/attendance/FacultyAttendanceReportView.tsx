'use client';

import { useFacultyAttendanceSummary } from '@/hooks/useAttendance';
import { UserCheck } from 'lucide-react';

interface Props {
  facultyId?: string;
}

export function FacultyAttendanceReportView({ facultyId }: Props) {
  const { data, isLoading } = useFacultyAttendanceSummary(facultyId);

  if (isLoading) {
    return <div className="h-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
        No faculty summary data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-600 dark:bg-teal-950/40 dark:text-teal-300">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Prof. {data.faculty.firstName} {data.faculty.lastName}
            </h2>
            <p className="text-xs text-[var(--muted)]">Employee ID: {data.faculty.employeeId}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <span className="text-xs font-medium text-[var(--muted)]">Total Sessions Conducted</span>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{data.totalSessionsMarked}</p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <span className="text-xs font-medium text-[var(--muted)]">Total Student Logs Marked</span>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{data.totalRecordsMarked}</p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <span className="text-xs font-medium text-[var(--muted)]">Average Class Attendance Rate</span>
            <p className="mt-1 text-2xl font-bold text-teal-600 dark:text-teal-400">
              {data.averageClassAttendance}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
