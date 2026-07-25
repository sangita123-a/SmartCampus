'use client';

import { useState } from 'react';
import {
  useAuthors,
  useBookCategories,
  useBookIssues,
  useBooks,
  useLibraryDashboard,
  usePublishers,
} from '@/hooks/useLibrary';
import { LibraryDashboardCards } from '@/components/library/LibraryDashboardCards';
import { BookTable } from '@/components/library/BookTable';
import { BookDetailsModal } from '@/components/library/BookDetailsModal';
import { IssueBookModal } from '@/components/library/IssueBookModal';
import { ReturnBookModal } from '@/components/library/ReturnBookModal';
import { AddEditBookModal } from '@/components/library/AddEditBookModal';
import { Book, BookIssue, BookStatus } from '@/types/library';
import { Plus, BookCheck, RotateCcw } from 'lucide-react';

export default function CollegeAdminLibraryPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'issues'>('catalog');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<BookStatus | undefined>();

  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<Book | null>(null);
  const [selectedIssueForReturn, setSelectedIssueForReturn] = useState<BookIssue | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: cards, isLoading: isCardsLoading } = useLibraryDashboard();
  const { data: categories = [] } = useBookCategories();
  const { data: authors = [] } = useAuthors();
  const { data: publishers = [] } = usePublishers();

  const { data: booksData, isLoading: isBooksLoading } = useBooks({
    page,
    limit: 10,
    search,
    categoryId: categoryFilter,
    status: statusFilter,
  });

  const { data: issuesData, isLoading: isIssuesLoading } = useBookIssues({ page: 1, limit: 20 });

  const handleOpenAdd = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Library Management System
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Manage book inventory, categories, authors, publishers, active borrowings, returns, and overdue fines.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Add Book to Catalog
        </button>
      </div>

      <LibraryDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="flex border-b border-[var(--border)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'catalog' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Book Inventory Catalog
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'issues' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Active Borrowings & Issues ({issuesData?.meta?.total || 0})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <BookTable
          books={booksData?.books || []}
          categories={categories}
          total={booksData?.meta?.total || 0}
          page={page}
          limit={10}
          onPageChange={setPage}
          onSearchChange={setSearch}
          onCategoryFilterChange={setCategoryFilter}
          onStatusFilterChange={setStatusFilter}
          onOpenIssue={(b) => setSelectedBookForIssue(b)}
          onOpenDetails={(b) => setSelectedBookForDetails(b)}
          onOpenEdit={handleOpenEdit}
          isLoading={isBooksLoading}
        />
      )}

      {activeTab === 'issues' && (
        <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
            <BookCheck className="h-5 w-5 text-teal-600" /> Active Library Borrowings
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3">Book Title</th>
                  <th className="px-4 py-3">Borrower</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {isIssuesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                    </tr>
                  ))
                ) : issuesData?.issues?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-[var(--muted)]">
                      No active borrowing records found.
                    </td>
                  </tr>
                ) : (
                  issuesData?.issues?.map((iss) => (
                    <tr key={iss.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{iss.book?.title}</td>
                      <td className="px-4 py-3 text-xs font-medium">
                        {iss.student
                          ? `${iss.student.firstName} ${iss.student.lastName} (${iss.student.rollNumber})`
                          : iss.faculty
                          ? `${iss.faculty.firstName} ${iss.faculty.lastName} (${iss.faculty.employeeId})`
                          : '-'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                        {new Date(iss.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-700">
                        {new Date(iss.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                            iss.status === 'ISSUED'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : iss.status === 'RETURNED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {iss.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {iss.status !== 'RETURNED' && (
                          <button
                            onClick={() => setSelectedIssueForReturn(iss)}
                            className="flex items-center gap-1 ml-auto rounded bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700 shadow-2xs"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBookForDetails && (
        <BookDetailsModal
          book={selectedBookForDetails}
          onClose={() => setSelectedBookForDetails(null)}
        />
      )}

      {selectedBookForIssue && (
        <IssueBookModal
          book={selectedBookForIssue}
          onClose={() => setSelectedBookForIssue(null)}
        />
      )}

      {selectedIssueForReturn && (
        <ReturnBookModal
          issue={selectedIssueForReturn}
          onClose={() => setSelectedIssueForReturn(null)}
        />
      )}

      {isModalOpen && (
        <AddEditBookModal
          bookToEdit={editingBook}
          categories={categories}
          authors={authors}
          publishers={publishers}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
