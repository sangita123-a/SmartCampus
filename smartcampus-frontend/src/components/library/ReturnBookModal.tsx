'use client';

import { useState } from 'react';
import { BookIssue } from '@/types/library';
import { useReturnBook } from '@/hooks/useLibrary';
import { BookCheck, Loader2, X, AlertCircle } from 'lucide-react';

interface Props {
  issue: BookIssue;
  onClose: () => void;
}

export function ReturnBookModal({ issue, onClose }: Props) {
  const returnDate = new Date();
  const dueDate = new Date(issue.dueDate);

  let initialFine = 0;
  if (returnDate > dueDate) {
    const diffTime = Math.abs(returnDate.getTime() - dueDate.getTime());
    const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    initialFine = overdueDays * 10;
  }

  const [fineAmount, setFineAmount] = useState<number>(initialFine);
  const [remarks, setRemarks] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const returnMutation = useReturnBook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    returnMutation.mutate(
      {
        issueId: issue.id,
        data: {
          fineAmount,
          remarks: remarks || undefined,
        },
      },
      {
        onSuccess: () => onClose(),
        onError: (err: unknown) => {
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to process return.'
          );
        },
      }
    );
  };

  const borrowerName = issue.student
    ? `${issue.student.firstName} ${issue.student.lastName} (${issue.student.rollNumber})`
    : issue.faculty
    ? `${issue.faculty.firstName} ${issue.faculty.lastName} (${issue.faculty.employeeId})`
    : 'Patron';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <BookCheck className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              Process Book Return
            </h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-[var(--muted)] hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-200">{issue.book?.title}</p>
          <p className="text-[11px] text-[var(--muted)]">Borrower: {borrowerName}</p>
          <p className="text-[11px] text-amber-700 font-mono">
            Due Date: {new Date(issue.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {initialFine > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            Overdue detected! Calculated late fine: ₹{initialFine}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Fine Amount (₹) *</label>
            <input
              type="number"
              min="0"
              value={fineAmount}
              onChange={(e) => setFineAmount(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Remarks / Condition Notes</label>
            <input
              type="text"
              placeholder="e.g. Returned in good condition"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={returnMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 shadow-xs"
            >
              {returnMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Confirm Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
