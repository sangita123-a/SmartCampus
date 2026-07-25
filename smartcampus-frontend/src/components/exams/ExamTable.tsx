'use client';

import { useState } from 'react';
import { ExamRecord, ExamStatus, ExamType } from '@/types/exam';
import { useDeleteExam, usePublishResults, useUnpublishResults } from '@/hooks/useExams';
import { Search, Edit2, Trash2, FileSpreadsheet, Globe, Lock, Trophy, BookOpen } from 'lucide-react';

interface Props {
  exams: ExamRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status?: ExamStatus) => void;
  onTypeFilterChange: (type?: ExamType) => void;
  onOpenMarksEntry: (exam: ExamRecord) => void;
  onOpenRankList: (exam: ExamRecord) => void;
  onOpenEdit: (exam: ExamRecord) => void;
  isLoading?: boolean;
}

export function ExamTable({
  exams,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onOpenMarksEntry,
  onOpenRankList,
  onOpenEdit,
  isLoading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const deleteMutation = useDeleteExam();
  const publishMutation = usePublishResults();
  const unpublishMutation = useUnpublishResults();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleTogglePublish = (exam: ExamRecord) => {
    if (exam.isPublished) {
      if (confirm(`Unpublish results for ${exam.examName}?`)) {
        unpublishMutation.mutate(exam.id);
      }
    } else {
      if (confirm(`Publish results for ${exam.examName}? Results will become visible to students.`)) {
        publishMutation.mutate(exam.id);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exam schedule?')) {
      deleteMutation.mutate(id);
    }
  };

  const exportCSV = () => {
    const headers = ['Exam Name', 'Type', 'Department', 'Course', 'Semester', 'Start Date', 'End Date', 'Status', 'Published'];
    const rows = exams.map((e) => [
      `"${e.examName}"`,
      e.examType,
      `"${e.department?.name || ''}"`,
      `"${e.course?.name || ''}"`,
      `"${e.semester?.name || ''}"`,
      new Date(e.startDate).toLocaleDateString(),
      new Date(e.endDate).toLocaleDateString(),
      e.status,
      e.isPublished ? 'YES' : 'NO',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_exams_${new Date().toISOString().split('T')[0]}.csv`);
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
            placeholder="Search exam name, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => onTypeFilterChange(e.target.value ? (e.target.value as ExamType) : undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Types</option>
            <option value="SEMESTER_END">SEMESTER_END</option>
            <option value="MID_SEMESTER">MID_SEMESTER</option>
            <option value="INTERNAL">INTERNAL</option>
            <option value="PRACTICAL">PRACTICAL</option>
            <option value="LAB">LAB</option>
            <option value="ASSIGNMENT">ASSIGNMENT</option>
            <option value="SUPPLEMENTARY">SUPPLEMENTARY</option>
          </select>

          <select
            onChange={(e) => onStatusFilterChange(e.target.value ? (e.target.value as ExamStatus) : undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
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
              <th className="px-4 py-3">Exam Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Department / Course</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : exams.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-[var(--muted)]">
                  No examinations found matching criteria.
                </td>
              </tr>
            ) : (
              exams.map((ex) => {
                const statusBadge =
                  ex.status === 'SCHEDULED'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : ex.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : ex.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                return (
                  <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{ex.examName}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {ex.examType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {ex.course?.name} ({ex.semester?.name})
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {new Date(ex.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} -{' '}
                      {new Date(ex.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadge}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {ex.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <Globe className="h-3.5 w-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--muted)]">
                          <Lock className="h-3.5 w-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenMarksEntry(ex)}
                          className="flex items-center gap-1 rounded bg-teal-600 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-700 shadow-2xs"
                          title="Enter student marks"
                        >
                          <BookOpen className="h-3.5 w-3.5" /> Marks
                        </button>
                        <button
                          onClick={() => onOpenRankList(ex)}
                          className="rounded p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          title="View Rank List"
                        >
                          <Trophy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(ex)}
                          disabled={publishMutation.isPending || unpublishMutation.isPending}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                          title={ex.isPublished ? 'Unpublish Results' : 'Publish Results'}
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(ex)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ex.id)}
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
          Showing page {page} of {totalPages || 1} ({total} total exams)
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
