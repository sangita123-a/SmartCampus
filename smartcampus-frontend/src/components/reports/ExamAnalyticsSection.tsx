'use client';

import { ExamReportData } from '@/types/report';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Award, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { ReportExportHeader } from './ReportExportHeader';

interface Props {
  data?: ExamReportData;
  isLoading?: boolean;
}

export function ExamAnalyticsSection({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const exportRows = data.topRankers.map((r) => ({
    Rank: r.rank,
    StudentName: r.studentName,
    RollNumber: r.rollNumber,
    ExamName: r.examName,
    Subject: r.subject,
    Marks: r.marks,
    Grade: r.grade,
  }));

  const passFailPieData = [
    { name: 'Passed', count: data.summary.passCount },
    { name: 'Failed', count: data.summary.failCount },
  ];

  return (
    <div className="space-y-6">
      <ReportExportHeader title="Examination Results & Academic Performance Analytics" exportData={exportRows} exportFilename="exam_report" />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Overall Pass Percentage</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight font-mono">
              {data.summary.passPercentage}%
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Success rate across exams</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Passed Results</span>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">{data.summary.passCount}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Cleared subject benchmarks</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600">Failed / Re-appear</span>
            <h3 className="mt-1 text-2xl font-extrabold text-rose-600 tracking-tight">{data.summary.failCount}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Supplementary candidates</p>
          </div>
          <div className="rounded-xl p-3 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600">Total Evaluated Papers</span>
            <h3 className="mt-1 text-2xl font-extrabold text-blue-600 tracking-tight">{data.summary.totalResults}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Published result entries</p>
          </div>
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Trophy className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grade Distribution Bar Chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Grade Distribution Frequency
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="grade" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass / Fail Pie Chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Pass vs. Fail Outcome Ratio
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailPieData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  <Cell fill="#0d9488" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Rankers Leaderboard */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" /> Academic Performance Top Rankers Leaderboard
        </h3>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-center">Rank</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Examination</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3 text-right">Marks</th>
                <th className="px-4 py-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {data.topRankers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-[var(--muted)]">
                    No top ranker entries available yet.
                  </td>
                </tr>
              ) : (
                data.topRankers.map((r) => (
                  <tr key={`${r.rank}-${r.rollNumber}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-center font-black font-mono text-teal-600">#{r.rank}</td>
                    <td className="px-4 py-3 font-bold text-[var(--foreground)]">{r.studentName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{r.rollNumber}</td>
                    <td className="px-4 py-3 text-xs">{r.examName}</td>
                    <td className="px-4 py-3 text-xs font-medium">{r.subject}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">{r.marks}</td>
                    <td className="px-4 py-3 text-center font-mono font-extrabold">{r.grade}</td>
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
