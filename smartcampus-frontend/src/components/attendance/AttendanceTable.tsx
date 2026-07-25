'use client';

import { useState } from 'react';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { useDeleteAttendance, useUpdateAttendance } from '@/hooks/useAttendance';
import { Search, Edit2, Trash2, FileSpreadsheet } from 'lucide-react';

interface Props {
  records: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status?: AttendanceStatus) => void;
  isLoading?: boolean;
}

export function AttendanceTable({
  records,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  isLoading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('PRESENT');
  const [newRemarks, setNewRemarks] = useState('');

  const updateMutation = useUpdateAttendance();
  const deleteMutation = useDeleteAttendance();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setNewStatus(rec.attendanceStatus);
    setNewRemarks(rec.remarks || '');
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;
    updateMutation.mutate(
      {
        id: editingRecord.id,
        data: {
          attendanceStatus: newStatus,
          remarks: newRemarks,
        },
      },
      {
        onSuccess: () => {
          setEditingRecord(null);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      deleteMutation.mutate(id);
    }
  };

  const exportCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Subject', 'Faculty', 'Date', 'Status', 'Method', 'Remarks'];
    const rows = records.map((r) => [
      r.student?.rollNumber || '',
      `"${r.student?.firstName || ''} ${r.student?.lastName || ''}"`,
      `"${r.subject?.subjectName || ''}"`,
      `"${r.faculty?.firstName || ''} ${r.faculty?.lastName || ''}"`,
      new Date(r.attendanceDate).toLocaleDateString(),
      r.attendanceStatus,
      r.attendanceMethod,
      `"${r.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search student, roll no, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => onStatusFilterChange(e.target.value ? (e.target.value as AttendanceStatus) : undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="LEAVE">Leave</option>
          </select>

          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Roll Number</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Faculty</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={9} className="h-12 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-sm text-[var(--muted)]">
                  No attendance records found matching criteria.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const statusBadge =
                  r.attendanceStatus === 'PRESENT'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : r.attendanceStatus === 'ABSENT'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : r.attendanceStatus === 'LATE'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{r.student?.rollNumber}</td>
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {r.student?.firstName} {r.student?.lastName}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">{r.subject?.subjectName}</td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {r.faculty?.firstName} {r.faculty?.lastName}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {new Date(r.attendanceDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge}`}>
                        {r.attendanceStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {r.attendanceMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">{r.remarks || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[var(--muted)]">
          Showing page {page} of {totalPages || 1} ({total} total records)
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

      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Edit Attendance Record</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {editingRecord.student?.firstName} {editingRecord.student?.lastName} - {editingRecord.subject?.subjectName}
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                  <option value="LEAVE">LEAVE</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Remarks</label>
                <input
                  type="text"
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
