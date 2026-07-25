'use client';

import { useState } from 'react';
import { PaymentStatus, StudentFeeRecord } from '@/types/finance';
import { Search, DollarSign, FileSpreadsheet, Eye } from 'lucide-react';

interface Props {
  records: StudentFeeRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status?: PaymentStatus) => void;
  onCollectPayment: (record: StudentFeeRecord) => void;
  onViewLedger?: (studentId: string) => void;
  isLoading?: boolean;
}

export function StudentFeeTable({
  records,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  onCollectPayment,
  onViewLedger,
  isLoading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const exportCSV = () => {
    const headers = [
      'Roll Number',
      'Student Name',
      'Fee Category',
      'Total Amount',
      'Paid Amount',
      'Remaining Amount',
      'Status',
      'Due Date',
    ];
    const rows = records.map((r) => [
      r.student?.rollNumber || '',
      `"${r.student?.firstName || ''} ${r.student?.lastName || ''}"`,
      `"${r.feeStructure?.feeCategory?.name || ''}"`,
      r.totalAmount,
      r.paidAmount,
      r.remainingAmount,
      r.paymentStatus,
      r.feeStructure?.dueDate ? new Date(r.feeStructure.dueDate).toLocaleDateString() : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_student_fees_${new Date().toISOString().split('T')[0]}.csv`);
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
            placeholder="Search student, roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => onStatusFilterChange(e.target.value ? (e.target.value as PaymentStatus) : undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="PENDING">PENDING</option>
            <option value="OVERDUE">OVERDUE</option>
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
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Fee Category</th>
              <th className="px-4 py-3 text-right">Total (₹)</th>
              <th className="px-4 py-3 text-right">Paid (₹)</th>
              <th className="px-4 py-3 text-right">Remaining (₹)</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={9} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-sm text-[var(--muted)]">
                  No student fee records found matching criteria.
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const statusBadge =
                  rec.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : rec.paymentStatus === 'PARTIAL'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : rec.paymentStatus === 'OVERDUE'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-mono text-xs font-bold">{rec.student?.rollNumber}</td>
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {rec.student?.firstName} {rec.student?.lastName}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {rec.feeStructure?.feeCategory?.name || 'Academic Fee'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold">
                      ₹{Number(rec.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(rec.paidAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      ₹{Number(rec.remainingAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {rec.feeStructure?.dueDate ? new Date(rec.feeStructure.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadge}`}>
                        {rec.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rec.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => onCollectPayment(rec)}
                            className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-700 shadow-2xs"
                          >
                            <DollarSign className="h-3.5 w-3.5" /> Pay
                          </button>
                        )}
                        {onViewLedger && rec.studentId && (
                          <button
                            onClick={() => onViewLedger(rec.studentId)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                            title="View Student Ledger"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
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
    </div>
  );
}
