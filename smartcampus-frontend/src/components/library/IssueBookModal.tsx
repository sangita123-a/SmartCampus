'use client';

import { useState } from 'react';
import { Book } from '@/types/library';
import { useIssueBook } from '@/hooks/useLibrary';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BookPlus, Loader2, X } from 'lucide-react';

interface Props {
  book: Book;
  onClose: () => void;
}

interface StudentItem {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
}

interface FacultyItem {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
}

export function IssueBookModal({ book, onClose }: Props) {
  const [borrowerType, setBorrowerType] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
  const [studentId, setStudentId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14); // 14 days borrowing period
    return defaultDate.toISOString().split('T')[0];
  });
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const issueMutation = useIssueBook();

  const { data: students = [] } = useQuery<StudentItem[]>({
    queryKey: ['students-list'],
    queryFn: async () => (await api.get('/students?limit=100')).data.data,
  });

  const { data: faculty = [] } = useQuery<FacultyItem[]>({
    queryKey: ['faculty-list'],
    queryFn: async () => (await api.get('/faculty?limit=100')).data.data,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (borrowerType === 'STUDENT' && !studentId) {
      setErrorMessage('Please select a student borrower.');
      return;
    }

    if (borrowerType === 'FACULTY' && !facultyId) {
      setErrorMessage('Please select a faculty borrower.');
      return;
    }

    issueMutation.mutate(
      {
        bookId: book.id,
        studentId: borrowerType === 'STUDENT' ? studentId : undefined,
        facultyId: borrowerType === 'FACULTY' ? facultyId : undefined,
        dueDate,
        remarks: remarks || undefined,
      },
      {
        onSuccess: () => onClose(),
        onError: (err: unknown) => {
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to issue book.'
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <BookPlus className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              Issue Book to Patron
            </h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-[var(--muted)] hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="font-bold text-slate-800 dark:text-slate-200">{book.title}</p>
          <p className="font-mono text-[11px] text-[var(--muted)]">ISBN: {book.isbn}</p>
          <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1">
            Available Copies: {book.availableCopies} / {book.totalCopies}
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Patron Type *</label>
            <div className="flex gap-4 text-xs font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="borrowerType"
                  value="STUDENT"
                  checked={borrowerType === 'STUDENT'}
                  onChange={() => setBorrowerType('STUDENT')}
                />
                Student
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="borrowerType"
                  value="FACULTY"
                  checked={borrowerType === 'FACULTY'}
                  onChange={() => setBorrowerType('FACULTY')}
                />
                Faculty
              </label>
            </div>
          </div>

          {borrowerType === 'STUDENT' ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Select Student *</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">-- Choose Student --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.rollNumber} - {st.firstName} {st.lastName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Select Faculty *</label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">-- Choose Faculty --</option>
                {faculty.map((fc) => (
                  <option key={fc.id} value={fc.id}>
                    {fc.employeeId} - {fc.firstName} {fc.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Return Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Remarks (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Good condition copy issued"
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
              disabled={issueMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 shadow-xs"
            >
              {issueMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
