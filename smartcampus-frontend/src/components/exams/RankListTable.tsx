'use client';

import { RankListItem } from '@/types/exam';
import { Trophy, FileSpreadsheet, Medal } from 'lucide-react';

interface Props {
  rankList: RankListItem[];
  examName?: string;
  isLoading?: boolean;
}

export function RankListTable({ rankList, examName, isLoading }: Props) {
  const exportCSV = () => {
    const headers = ['Rank', 'Roll Number', 'Student Name', 'Total Marks', 'Max Marks', 'Percentage', 'GPA', 'Result Status'];
    const rows = rankList.map((r) => [
      r.rank,
      r.rollNumber,
      `"${r.studentName}"`,
      r.totalObtained,
      r.totalMax,
      r.percentage,
      r.gpa,
      r.overallStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_rank_list_${examName || 'exam'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Class Rank List {examName ? `- ${examName}` : ''}
          </h3>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 text-center">Rank</th>
              <th className="px-4 py-3">Roll Number</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3 text-right">Obtained Marks</th>
              <th className="px-4 py-3 text-right">Percentage</th>
              <th className="px-4 py-3 text-center">GPA</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : rankList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-[var(--muted)]">
                  No rank list data evaluated yet.
                </td>
              </tr>
            ) : (
              rankList.map((item) => {
                const isTopThree = item.rank <= 3;
                const medalColor =
                  item.rank === 1 ? 'text-amber-500' : item.rank === 2 ? 'text-slate-400' : 'text-amber-700';

                return (
                  <tr
                    key={item.studentId}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 ${
                      isTopThree ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      {isTopThree ? (
                        <span className="inline-flex items-center gap-1 font-extrabold text-sm">
                          <Medal className={`h-4 w-4 ${medalColor}`} /> #{item.rank}
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-bold text-[var(--muted)]">#{item.rank}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">{item.rollNumber}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{item.studentName}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold">
                      {item.totalObtained} / {item.totalMax}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                      {item.percentage}%
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs font-extrabold text-blue-700 dark:text-blue-400">
                      {item.gpa.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                          item.overallStatus === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {item.overallStatus}
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
  );
}
