'use client';

import { LibraryReportData } from '@/types/report';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Library, BookOpen, BookmarkCheck, RotateCcw } from 'lucide-react';
import { ReportExportHeader } from './ReportExportHeader';

interface Props {
  data?: LibraryReportData;
  isLoading?: boolean;
}

export function LibraryAnalyticsSection({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const exportRows = data.mostBorrowed.map((b) => ({
    ISBN: b.isbn,
    Title: b.title,
    Author: b.author,
    TimesBorrowed: b.borrowCount,
  }));

  return (
    <div className="space-y-6">
      <ReportExportHeader title="Library System Inventory & Circulation Analytics" exportData={exportRows} exportFilename="library_report" />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)] font-mono">Catalog Titles / Copies</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
              {data.summary.totalBooks} <span className="text-sm font-normal text-[var(--muted)]">({data.summary.totalCopies} copies)</span>
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Registered library inventory</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Library className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Available Copies</span>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">{data.summary.availableCopies}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Ready for immediate issue</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600">Active Borrowed Copies</span>
            <h3 className="mt-1 text-2xl font-extrabold text-amber-600 tracking-tight">{data.summary.currentIssued}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Currently on loan</p>
          </div>
          <div className="rounded-xl p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <BookmarkCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600">Total Returned Issues</span>
            <h3 className="mt-1 text-2xl font-extrabold text-blue-600 tracking-tight">{data.summary.returnedCount}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Cleared borrowing transactions</p>
          </div>
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <RotateCcw className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Most Borrowed Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown Bar Chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Category-wise Book Titles Distribution
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="categoryName" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="bookCount" name="Titles" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Borrowed Leaderboard */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Top Borrowed Book Titles
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--background)] font-semibold text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2.5">Book Title</th>
                  <th className="px-3 py-2.5">Author</th>
                  <th className="px-3 py-2.5 text-right">Circulation Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {data.mostBorrowed.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-xs text-[var(--muted)]">
                      No circulation activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.mostBorrowed.map((b) => (
                    <tr key={b.isbn} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2.5 font-bold text-[var(--foreground)]">{b.title}</td>
                      <td className="px-3 py-2.5 text-[var(--muted)]">{b.author}</td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-teal-600">{b.borrowCount} issues</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
