'use client';

import { Book } from '@/types/library';
import { X, BookOpen, MapPin, Hash, UserCheck, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Props {
  book: Book;
  onClose: () => void;
}

export function BookDetailsModal({ book, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              Book Details & Catalog Entry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="h-44 w-32 shrink-0 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-md">
            {book.coverImage ? (
              <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
            ) : (
              <BookOpen className="h-10 w-10 text-[var(--muted)]" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {book.category?.name || 'Category'}
              </span>
              <h3 className="text-xl font-black text-[var(--foreground)] font-[family-name:var(--font-display)]">
                {book.title}
              </h3>
              <p className="text-xs font-semibold text-[var(--muted)]">By {book.author?.name || 'Unknown Author'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-[var(--muted)]" />
                <div>
                  <span className="text-[10px] text-[var(--muted)] block">ISBN Code</span>
                  <span className="font-mono font-bold">{book.isbn}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[var(--muted)]" />
                <div>
                  <span className="text-[10px] text-[var(--muted)] block">Rack / Shelf Location</span>
                  <span className="font-mono font-bold">
                    Rack {book.rackNumber || '-'} / Shelf {book.shelfNumber || '-'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-[var(--muted)]" />
                <div>
                  <span className="text-[10px] text-[var(--muted)] block">Publisher</span>
                  <span className="font-semibold">{book.publisher?.name || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[var(--muted)]" />
                <div>
                  <span className="text-[10px] text-[var(--muted)] block">Language & Year</span>
                  <span className="font-semibold">
                    {book.language} ({book.publicationYear || '-'})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span>
                Available Copies:{' '}
                <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">{book.availableCopies}</strong> /{' '}
                {book.totalCopies}
              </span>
              <span>
                Status: <strong className="uppercase font-mono text-sm">{book.status}</strong>
              </span>
            </div>
          </div>
        </div>

        {book.description && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-[var(--foreground)]">Description & Synopsis</span>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{book.description}</p>
          </div>
        )}

        {/* Borrow History */}
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Recent Borrowing Transactions</h4>
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--background)] font-semibold text-[var(--muted)]">
                <tr>
                  <th className="p-2.5">Borrower</th>
                  <th className="p-2.5">Issue Date</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5">Return Date</th>
                  <th className="p-2.5 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {book.issues?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-xs text-[var(--muted)]">
                      No borrowing transactions logged for this book.
                    </td>
                  </tr>
                ) : (
                  book.issues?.map((iss) => (
                    <tr key={iss.id}>
                      <td className="p-2.5 font-semibold">
                        {iss.student
                          ? `${iss.student.firstName} ${iss.student.lastName} (${iss.student.rollNumber})`
                          : iss.faculty
                          ? `${iss.faculty.firstName} ${iss.faculty.lastName} (${iss.faculty.employeeId})`
                          : 'Unknown'}
                      </td>
                      <td className="p-2.5 font-mono">{new Date(iss.issueDate).toLocaleDateString()}</td>
                      <td className="p-2.5 font-mono text-amber-700">{new Date(iss.dueDate).toLocaleDateString()}</td>
                      <td className="p-2.5 font-mono text-emerald-700">
                        {iss.returnDate ? new Date(iss.returnDate).toLocaleDateString() : 'Active Issue'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold">₹{iss.fineAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
