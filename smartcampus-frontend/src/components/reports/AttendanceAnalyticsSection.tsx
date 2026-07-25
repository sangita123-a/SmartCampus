'use client';

import { AttendanceReportData } from '@/types/report';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CalendarCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { ReportExportHeader } from './ReportExportHeader';

interface Props {
  data?: AttendanceReportData;
  isLoading?: boolean;
}

export function AttendanceAnalyticsSection({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const exportRows = data.subjectWise.map((s) => ({
    SubjectCode: s.subjectCode,
    SubjectName: s.subjectName,
    TotalClasses: s.total,
    PresentClasses: s.present,
    AttendancePercentage: `${s.percentage}%`,
  }));

  return (
    <div className="space-y-6">
      <ReportExportHeader title="Institution Attendance Analytics & Compliance" exportData={exportRows} exportFilename="attendance_report" />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Overall Attendance Rate</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight font-mono">
              {data.summary.overallPercentage}%
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Evaluated class sessions</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <CalendarCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Present Sessions</span>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">{data.summary.presentCount}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Students marked present</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600">Absent Sessions</span>
            <h3 className="mt-1 text-2xl font-extrabold text-rose-600 tracking-tight">{data.summary.absentCount}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Absences recorded</p>
          </div>
          <div className="rounded-xl p-3 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600">Late & Leave Logs</span>
            <h3 className="mt-1 text-2xl font-extrabold text-amber-600 tracking-tight">
              {data.summary.lateCount + data.summary.leaveCount}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Excused or late entries</p>
          </div>
          <div className="rounded-xl p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Subject Attendance Breakdown Chart */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
          Subject-wise Attendance Ratios (%)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.subjectWise}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="subjectCode" stroke="var(--muted)" fontSize={12} />
              <YAxis stroke="var(--muted)" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="percentage" name="Attendance %" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
