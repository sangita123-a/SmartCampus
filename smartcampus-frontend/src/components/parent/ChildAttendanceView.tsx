'use client';

import { ParentAttendanceData } from '@/types/parent';
import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  data?: ParentAttendanceData;
  isLoading?: boolean;
}

export function ChildAttendanceView({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const pct = data.overallPercentage;
  const isHealthy = pct >= 75;

  return (
    <div className="space-y-6">
      {/* Attendance Summary Banner */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Child Overall Attendance Performance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight font-[family-name:var(--font-display)]">
                {pct}%
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isHealthy
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {isHealthy ? 'Good Standing (≥75%)' : 'Attendance Warning (<75%)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <span className="text-[10px] text-[var(--muted)] block">Present</span>
                <span className="font-bold text-sm">{data.presentClasses} Classes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-600" />
              <div>
                <span className="text-[10px] text-[var(--muted)] block">Absent</span>
                <span className="font-bold text-sm">{data.absentClasses} Classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-teal-600" /> Subject-wise Attendance Breakdown
        </h3>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Subject Code & Name</th>
                <th className="px-4 py-3 text-center">Classes Attended</th>
                <th className="px-4 py-3 text-center">Total Conducted</th>
                <th className="px-4 py-3">Attendance Ratio</th>
                <th className="px-4 py-3 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {data.subjectWise.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm text-[var(--muted)]">
                    No attendance records evaluated yet.
                  </td>
                </tr>
              ) : (
                data.subjectWise.map((sw) => (
                  <tr key={sw.subjectCode} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--foreground)]">{sw.subjectName}</p>
                      <span className="font-mono text-xs text-[var(--muted)]">{sw.subjectCode}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {sw.present}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-[var(--muted)]">{sw.total}</td>
                    <td className="px-4 py-3">
                      <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${sw.percentage >= 75 ? 'bg-teal-600' : 'bg-rose-500'}`}
                          style={{ width: `${sw.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-extrabold text-sm">
                      <span className={sw.percentage >= 75 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}>
                        {sw.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
