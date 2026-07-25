'use client';

import { ParentResultsData } from '@/types/parent';
import { Award, Printer, Medal } from 'lucide-react';

interface Props {
  data?: ParentResultsData;
  isLoading?: boolean;
}

export function ChildResultsView({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Evaluated Subjects</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
              {data.summary.totalSubjectsEvaluated}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Published examination results</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600">Cumulative CGPA</span>
            <h3 className="mt-1 text-2xl font-extrabold text-blue-600 tracking-tight font-mono">
              {data.summary.cgpa.toFixed(2)}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Weighted cumulative grade point average</p>
          </div>
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Medal className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 print:hidden">
          <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" /> Academic Exam Performance & Marksheets
          </h3>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Printer className="h-4 w-4 text-teal-600" /> Print Marksheet
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Exam Session</th>
                <th className="px-4 py-3">Subject Code & Name</th>
                <th className="px-4 py-3 text-center">Credits</th>
                <th className="px-4 py-3 text-right">Obtained Marks</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Grade Point</th>
                <th className="px-4 py-3 text-center">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {data.results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-[var(--muted)]">
                    No published exam results found for this child.
                  </td>
                </tr>
              ) : (
                data.results.map((res) => {
                  const statusBadge =
                    res.resultStatus === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{res.exam?.examName}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[var(--foreground)]">{res.subject?.subjectName}</p>
                        <span className="font-mono text-xs text-[var(--muted)]">{res.subject?.subjectCode}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{res.subject?.credits}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">
                        {res.obtainedMarks}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-extrabold text-sm">{res.grade}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold">{res.gradePoint}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded px-2.5 py-0.5 text-xs font-bold ${statusBadge}`}>
                          {res.resultStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
