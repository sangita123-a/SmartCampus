'use client';

import { useState } from 'react';
import { useBookCategories, useBooks, useLibraryDashboard } from '@/hooks/useLibrary';
import { LibraryDashboardCards } from '@/components/library/LibraryDashboardCards';
import { BookTable } from '@/components/library/BookTable';
import { BookDetailsModal } from '@/components/library/BookDetailsModal';
import { Book } from '@/types/library';

export default function SuperAdminLibraryPage() {
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);

  const { data: cards, isLoading: isCardsLoading } = useLibraryDashboard();
  const { data: categories = [] } = useBookCategories();
  const { data: booksData, isLoading: isBooksLoading } = useBooks({ limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Super Admin - Master Library System Overview
        </h1>
        <p className="text-xs text-[var(--muted)]">Global library metrics, total catalog holdings, active circulation count, and fine collection statistics.</p>
      </div>

      <LibraryDashboardCards data={cards} isLoading={isCardsLoading} />

      <div>
        <h2 className="mb-3 text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
          Master Library Catalog
        </h2>
        <BookTable
          books={booksData?.books || []}
          categories={categories}
          total={booksData?.meta?.total || 0}
          page={1}
          limit={10}
          onPageChange={() => {}}
          onSearchChange={() => {}}
          onCategoryFilterChange={() => {}}
          onStatusFilterChange={() => {}}
          onOpenIssue={() => {}}
          onOpenDetails={(b) => setSelectedBookForDetails(b)}
          onOpenEdit={() => {}}
          isLoading={isBooksLoading}
        />
      </div>

      {selectedBookForDetails && (
        <BookDetailsModal
          book={selectedBookForDetails}
          onClose={() => setSelectedBookForDetails(null)}
        />
      )}
    </div>
  );
}
