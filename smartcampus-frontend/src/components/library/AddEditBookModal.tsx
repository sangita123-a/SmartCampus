'use client';

import { useState } from 'react';
import { Author, Book, BookCategory, BookStatus, Publisher } from '@/types/library';
import { useCreateBook, useUpdateBook } from '@/hooks/useLibrary';
import { Loader2 } from 'lucide-react';

interface Props {
  bookToEdit?: Book | null;
  categories: BookCategory[];
  authors: Author[];
  publishers: Publisher[];
  onClose: () => void;
}

export function AddEditBookModal({
  bookToEdit,
  categories,
  authors,
  publishers,
  onClose,
}: Props) {
  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [isbn, setIsbn] = useState(bookToEdit?.isbn || '');
  const [categoryId, setCategoryId] = useState(bookToEdit?.categoryId || categories[0]?.id || '');
  const [authorId, setAuthorId] = useState(bookToEdit?.authorId || authors[0]?.id || '');
  const [publisherId, setPublisherId] = useState(bookToEdit?.publisherId || publishers[0]?.id || '');
  const [edition, setEdition] = useState(bookToEdit?.edition || '');
  const [language, setLanguage] = useState(bookToEdit?.language || 'English');
  const [publicationYear, setPublicationYear] = useState<number | undefined>(bookToEdit?.publicationYear || 2024);
  const [totalCopies, setTotalCopies] = useState<number>(bookToEdit?.totalCopies || 1);
  const [rackNumber, setRackNumber] = useState(bookToEdit?.rackNumber || '');
  const [shelfNumber, setShelfNumber] = useState(bookToEdit?.shelfNumber || '');
  const [coverImage, setCoverImage] = useState(bookToEdit?.coverImage || '');
  const [description, setDescription] = useState(bookToEdit?.description || '');
  const [status, setStatus] = useState<BookStatus>(bookToEdit?.status || 'AVAILABLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      title,
      isbn,
      categoryId,
      authorId,
      publisherId,
      edition: edition || undefined,
      language,
      publicationYear: publicationYear ? Number(publicationYear) : undefined,
      totalCopies: Number(totalCopies),
      rackNumber: rackNumber || undefined,
      shelfNumber: shelfNumber || undefined,
      coverImage: coverImage || undefined,
      description: description || undefined,
      status,
    };

    if (bookToEdit) {
      updateMutation.mutate(
        { id: bookToEdit.id, data: payload },
        {
          onSuccess: () => onClose(),
          onError: (err: unknown) =>
            setErrorMessage(
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update book.'
            ),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (err: unknown) =>
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add book.'
          ),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
          {bookToEdit ? 'Edit Book Record' : 'Add New Book to Inventory'}
        </h3>

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Book Title *</label>
              <input
                type="text"
                placeholder="e.g. Clean Code: A Handbook of Agile Craftsmanship"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">ISBN Code *</label>
              <input
                type="text"
                placeholder="e.g. 978-0132350884"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Author *</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Publisher *</label>
              <select
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Edition</label>
              <input
                type="text"
                placeholder="e.g. 1st Edition"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Publication Year</label>
              <input
                type="number"
                value={publicationYear || ''}
                onChange={(e) => setPublicationYear(parseInt(e.target.value, 10) || undefined)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Total Copies *</label>
              <input
                type="number"
                min="1"
                value={totalCopies}
                onChange={(e) => setTotalCopies(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Rack Number</label>
              <input
                type="text"
                placeholder="e.g. A-12"
                value={rackNumber}
                onChange={(e) => setRackNumber(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Shelf Number</label>
              <input
                type="text"
                placeholder="e.g. Shelf 3"
                value={shelfNumber}
                onChange={(e) => setShelfNumber(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="ISSUED">ISSUED</option>
                <option value="RESERVED">RESERVED</option>
                <option value="LOST">LOST</option>
                <option value="DAMAGED">DAMAGED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Cover Image URL (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Description & Synopsis</label>
            <textarea
              rows={3}
              placeholder="Brief summary or key chapters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Book Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
