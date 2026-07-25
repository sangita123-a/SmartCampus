import { api } from '@/lib/api';
import {
  Author,
  Book,
  BookCategory,
  BookIssue,
  BookReservation,
  LibraryDashboardCardsData,
  Publisher,
} from '@/types/library';

export const libraryApi = {
  // Categories
  listCategories: async () => {
    const res = await api.get<{ success: boolean; data: BookCategory[] }>('/library/categories');
    return res.data.data;
  },
  createCategory: async (data: Partial<BookCategory>) => {
    const res = await api.post<{ success: boolean; data: BookCategory }>('/library/categories', data);
    return res.data.data;
  },

  // Authors & Publishers
  listAuthors: async () => {
    const res = await api.get<{ success: boolean; data: Author[] }>('/library/authors');
    return res.data.data;
  },
  createAuthor: async (data: Partial<Author>) => {
    const res = await api.post<{ success: boolean; data: Author }>('/library/authors', data);
    return res.data.data;
  },
  listPublishers: async () => {
    const res = await api.get<{ success: boolean; data: Publisher[] }>('/library/publishers');
    return res.data.data;
  },
  createPublisher: async (data: Partial<Publisher>) => {
    const res = await api.post<{ success: boolean; data: Publisher }>('/library/publishers', data);
    return res.data.data;
  },

  // Books Inventory
  listBooks: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; books: Book[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/library/books', { params });
    return res.data;
  },
  getBookById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: Book }>(`/library/books/${id}`);
    return res.data.data;
  },
  createBook: async (data: Partial<Book>) => {
    const res = await api.post<{ success: boolean; data: Book }>('/library/books', data);
    return res.data.data;
  },
  updateBook: async (id: string, data: Partial<Book>) => {
    const res = await api.put<{ success: boolean; data: Book }>(`/library/books/${id}`, data);
    return res.data.data;
  },
  deleteBook: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/library/books/${id}`);
    return res.data;
  },

  // Issues & Returns
  listIssues: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; issues: BookIssue[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/library/issues', { params });
    return res.data;
  },
  issueBook: async (data: { bookId: string; studentId?: string; facultyId?: string; dueDate: string; remarks?: string }) => {
    const res = await api.post<{ success: boolean; data: BookIssue }>('/library/issues', data);
    return res.data.data;
  },
  returnBook: async (issueId: string, data: { fineAmount?: number; remarks?: string }) => {
    const res = await api.post<{ success: boolean; data: BookIssue }>(`/library/issues/${issueId}/return`, data);
    return res.data.data;
  },

  // Reservations
  listReservations: async () => {
    const res = await api.get<{ success: boolean; data: BookReservation[] }>('/library/reservations');
    return res.data.data;
  },
  reserveBook: async (data: { bookId: string; studentId: string; expiryDate: string }) => {
    const res = await api.post<{ success: boolean; data: BookReservation }>('/library/reservations', data);
    return res.data.data;
  },
  cancelReservation: async (id: string) => {
    const res = await api.post<{ success: boolean; data: BookReservation }>(`/library/reservations/${id}/cancel`);
    return res.data.data;
  },

  // Dashboard Cards
  getDashboardCards: async () => {
    const res = await api.get<{ success: boolean; data: LibraryDashboardCardsData }>('/library/dashboard');
    return res.data.data;
  },
};
