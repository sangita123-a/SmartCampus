'use client';

import { useState } from 'react';
import { PaymentMethod, PaymentRecord } from '@/types/finance';
import { Search, FileSpreadsheet, Eye } from 'lucide-react';

interface Props {
  payments: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onMethodFilterChange: (method?: PaymentMethod) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
  isLoading?: boolean;
}

export function PaymentHistoryTable({
  payments,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onMethodFilterChange,
  onViewReceipt,
  isLoading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const exportCSV = () => {
    const headers = ['Receipt No', 'Student', 'Roll No', 'Amount (₹)', 'Payment Mode', 'Txn ID', 'Date'];
    const rows = payments.map((p) => [
      p.receiptNumber,
      `"${p.studentFee?.student?.firstName || ''} ${p.studentFee?.student?.lastName || ''}"`,
      p.studentFee?.student?.rollNumber || '',
      p.amount,
      p.paymentMethod,
      p.transactionId || '',
      new Date(p.paymentDate).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_payment_history_${new Date().toISOString().split('T')[0]}.csv`);
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
            placeholder="Search receipt no, txn ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => onMethodFilterChange(e.target.value ? (e.target.value as PaymentMethod) : undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Payment Modes</option>
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
            <option value="NET_BANKING">NET_BANKING</option>
            <option value="CHEQUE">CHEQUE</option>
            <option value="ONLINE_GATEWAY">ONLINE_GATEWAY</option>
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
              <th className="px-4 py-3">Receipt No</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-right">Amount (₹)</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Payment Date</th>
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
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-[var(--muted)]">
                  No payment history found.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-mono text-xs font-extrabold text-teal-700 dark:text-teal-400">
                    {p.receiptNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    {p.studentFee?.student?.firstName} {p.studentFee?.student?.lastName}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Number(p.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{p.transactionId || '-'}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {new Date(p.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onViewReceipt(p)}
                      className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-2.5 py-1 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Eye className="h-3.5 w-3.5" /> Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[var(--muted)]">
          Showing page {page} of {totalPages || 1} ({total} total transactions)
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
