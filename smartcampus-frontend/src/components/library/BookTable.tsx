'use client';

import { useState } from 'react';
import { Book, BookCategory, BookStatus } from '@/types/library';
import { useDeleteBook } from '@/hooks/useLibrary';
import { Search, Edit2, Trash2, FileSpreadsheet, Eye, BookPlus, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface Props {
  books: Book[];
  categories: BookCategory[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onCategoryFilterChange: (catId?: string) => void;
  onStatusFilterChange: (status?: BookStatus) => void;
  onOpenIssue: (book: Book) => void;
  onOpenDetails: (book: Book) => void;
  onOpenEdit: (book: Book) => void;
  isLoading?: boolean;
}

export function BookTable({
  books,
  categories,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onOpenIssue,
  onOpenDetails,
  onOpenEdit,
  isLoading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const deleteMutation = useDeleteBook();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from inventory?`)) {
      deleteMutation.mutate(id);
    }
  };

  const exportCSV = () => {
    const headers = ['ISBN', 'Title', 'Category', 'Author', 'Publisher', 'Edition', 'Rack/Shelf', 'Available Copies', 'Total Copies', 'Status'];
    const rows = books.map((b) => [
      b.isbn,
      `"${b.title}"`,
      `"${b.category?.name || ''}"`,
      `"${b.author?.name || ''}"`,
      `"${b.publisher?.name || ''}"`,
      b.edition || '',
      `"Rack ${b.rackNumber || '-'} Shelf ${b.shelfNumber || '-'}"`,
      b.availableCopies,
      b.totalCopies,
      b.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcampus_library_catalog_${new Date().toISOString().split('T')[0]}.csv`);
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
            placeholder="Search title, ISBN, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => onCategoryFilterChange(e.target.value || undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => onStatusFilterChange(e.target.value ? (e.target.value as BookStatus) : undefined)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="ISSUED">ISSUED</option>
            <option value="RESERVED">RESERVED</option>
            <option value="LOST">LOST</option>
            <option value="DAMAGED">DAMAGED</option>
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
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">ISBN</th>
              <th className="px-4 py-3">Category / Author</th>
              <th className="px-4 py-3 text-center">Rack / Shelf</th>
              <th className="px-4 py-3 text-center">Available / Total</th>
              <th className="px-4 py-3 text-center">Status</th>
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
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-[var(--muted)]">
                  No books found matching criteria in library catalog.
                </td>
              </tr>
            ) : (
              books.map((b) => {
                const statusBadge =
                  b.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : b.status === 'ISSUED'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : b.status === 'RESERVED'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-8 shrink-0 relative rounded overflow-hidden bg-slate-100 border border-slate-200 dark:bg-slate-800 flex items-center justify-center">
                          {b.coverImage ? (
                            <Image src={b.coverImage} alt={b.title} fill className="object-cover" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-[var(--muted)]" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)] leading-snug">{b.title}</p>
                          {b.edition && <span className="text-[11px] text-[var(--muted)]">{b.edition} Ed.</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--foreground)]">{b.isbn}</td>
                    <td className="px-4 py-3 text-xs">
                      <p className="font-medium text-[var(--foreground)]">{b.category?.name || 'Uncategorized'}</p>
                      <p className="text-[11px] text-[var(--muted)]">{b.author?.name || 'Unknown Author'}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-mono text-[var(--muted)]">
                      R{b.rackNumber || '-'} / S{b.shelfNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs font-extrabold">
                      <span className={b.availableCopies > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}>
                        {b.availableCopies}
                      </span>{' '}
                      / {b.totalCopies}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${statusBadge}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenIssue(b)}
                          disabled={b.availableCopies <= 0}
                          className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-40 shadow-2xs"
                          title="Issue this book"
                        >
                          <BookPlus className="h-3.5 w-3.5" /> Issue
                        </button>
                        <button
                          onClick={() => onOpenDetails(b)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                          title="View Book Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(b)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.title)}
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
          Showing page {page} of {totalPages || 1} ({total} total books)
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
