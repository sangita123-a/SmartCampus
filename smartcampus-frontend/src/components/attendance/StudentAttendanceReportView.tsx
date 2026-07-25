'use client';

import { useStudentAttendanceReport } from '@/hooks/useAttendance';
import { Award, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  studentId?: string;
}

export function StudentAttendanceReportView({ studentId }: Props) {
  const { data, isLoading } = useStudentAttendanceReport(studentId);

  if (isLoading) {
    return <div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
        No attendance report data available.
      </div>
    );
  }

  const isEligible = data.overallPercentage >= 75;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Student Attendance Performance
            </span>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {data.student.firstName} {data.student.lastName}
            </h2>
            <p className="text-xs text-[var(--muted)]">Roll No: {data.student.rollNumber}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-medium text-[var(--muted)]">Overall Attendance</p>
              <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                {data.overallPercentage}%
              </p>
            </div>
            <div
              className={`rounded-xl p-3 ${
                isEligible
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {isEligible ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
          <Award className="h-4 w-4 text-amber-500" />
          <span>
            Requirement: <strong className="text-[var(--foreground)]">75% Minimum Attendance</strong> for Exam Eligibility.{' '}
            {isEligible ? (
              <span className="font-semibold text-emerald-600">Eligible for examinations</span>
            ) : (
              <span className="font-semibold text-rose-600">Shortage alert! Contact academic counselor</span>
            )}
          </span>
        </div>
      </div>

      {/* Subject Wise Progress Breakdown */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-[var(--foreground)]">Subject-wise Breakdown</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.subjectBreakdown.map((sb) => {
            const colorClass =
              sb.percentage >= 75
                ? 'bg-emerald-500'
                : sb.percentage >= 60
                ? 'bg-amber-500'
                : 'bg-rose-500';

            return (
              <div
                key={sb.subjectId}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                    <BookOpen className="h-4 w-4 text-teal-600" /> {sb.subjectName}
                  </span>
                  <span className="font-bold text-sm text-[var(--foreground)]">{sb.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${sb.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-[var(--muted)] pt-1">
                  <span>
                    Attended: {sb.present} / {sb.total} classes
                  </span>
                  <span>Absent: {sb.absent}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
