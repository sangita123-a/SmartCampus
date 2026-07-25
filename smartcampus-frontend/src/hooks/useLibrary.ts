import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '@/services/library.service';
import { Author, Book, BookCategory, Publisher } from '@/types/library';

export function useBookCategories() {
  return useQuery({
    queryKey: ['library', 'categories'],
    queryFn: () => libraryApi.listCategories(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BookCategory>) => libraryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'categories'] });
    },
  });
}

export function useAuthors() {
  return useQuery({
    queryKey: ['library', 'authors'],
    queryFn: () => libraryApi.listAuthors(),
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Author>) => libraryApi.createAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'authors'] });
    },
  });
}

export function usePublishers() {
  return useQuery({
    queryKey: ['library', 'publishers'],
    queryFn: () => libraryApi.listPublishers(),
  });
}

export function useCreatePublisher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Publisher>) => libraryApi.createPublisher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'publishers'] });
    },
  });
}

export function useBooks(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['library', 'books', params],
    queryFn: () => libraryApi.listBooks(params),
  });
}

export function useBookDetails(id: string) {
  return useQuery({
    queryKey: ['library', 'books', id],
    queryFn: () => libraryApi.getBookById(id),
    enabled: Boolean(id),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Book>) => libraryApi.createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) => libraryApi.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'books'] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => libraryApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'books'] });
    },
  });
}

export function useBookIssues(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['library', 'issues', params],
    queryFn: () => libraryApi.listIssues(params),
  });
}

export function useIssueBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookId: string; studentId?: string; facultyId?: string; dueDate: string; remarks?: string }) =>
      libraryApi.issueBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

export function useReturnBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, data }: { issueId: string; data: { fineAmount?: number; remarks?: string } }) =>
      libraryApi.returnBook(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

export function useBookReservations() {
  return useQuery({
    queryKey: ['library', 'reservations'],
    queryFn: () => libraryApi.listReservations(),
  });
}

export function useReserveBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookId: string; studentId: string; expiryDate: string }) => libraryApi.reserveBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => libraryApi.cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

export function useLibraryDashboard() {
  return useQuery({
    queryKey: ['library', 'dashboard'],
    queryFn: () => libraryApi.getDashboardCards(),
  });
}
