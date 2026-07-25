'use client';

import { useState } from 'react';
import { useBookCategories, useBooks } from '@/hooks/useLibrary';
import { BookTable } from '@/components/library/BookTable';
import { BookDetailsModal } from '@/components/library/BookDetailsModal';
import { Book, BookStatus } from '@/types/library';

export default function FacultyLibraryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<BookStatus | undefined>();
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);

  const { data: categories = [] } = useBookCategories();
  const { data: booksData, isLoading } = useBooks({
    page,
    limit: 10,
    search,
    categoryId: categoryFilter,
    status: statusFilter,
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Faculty Library Catalog Search
        </h1>
        <p className="text-xs text-[var(--muted)]">Search library catalog books, check rack/shelf location, and view borrowing records.</p>
      </div>

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
        onOpenIssue={() => {}}
        onOpenDetails={(b) => setSelectedBookForDetails(b)}
        onOpenEdit={() => {}}
        isLoading={isLoading}
      />

      {selectedBookForDetails && (
        <BookDetailsModal
          book={selectedBookForDetails}
          onClose={() => setSelectedBookForDetails(null)}
        />
      )}
    </div>
  );
}
