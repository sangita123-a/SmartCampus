'use client';

import { TimetableSlot } from '@/types/timetable';
import { Edit2, Trash2, FileSpreadsheet } from 'lucide-react';

interface Props {
  slots: TimetableSlot[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onEdit: (slot: TimetableSlot) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TimetableListView({
  slots,
  total,
  page,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  isLoading,
}: Props) {
  const exportCSV = () => {
    const headers = ['Day', 'Start Time', 'End Time', 'Subject', 'Faculty', 'Classroom', 'Semester', 'Status'];
    const rows = slots.map((s) => [
      s.dayOfWeek,
      s.startTime,
      s.endTime,
      `"${s.subject?.subjectName || ''}"`,
      `"${s.faculty?.firstName || ''} ${s.faculty?.lastName || ''}"`,
      `"${s.classroom?.roomNumber || ''}"`,
      `"${s.semester?.name || ''}"`,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_timetable_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Time Slot</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Faculty</th>
              <th className="px-4 py-3">Classroom</th>
              <th className="px-4 py-3">Semester</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : slots.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-[var(--muted)]">
                  No scheduled timetable entries found.
                </td>
              </tr>
            ) : (
              slots.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-xs text-teal-700 dark:text-teal-400 uppercase">
                    {s.dayOfWeek}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    {s.startTime} - {s.endTime}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{s.subject?.subjectName}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {s.faculty?.firstName} {s.faculty?.lastName}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)] font-mono">
                    Rm {s.classroom?.roomNumber}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">{s.semester?.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(s)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[var(--muted)]">
          Page {page} of {totalPages || 1} ({total} entries)
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
