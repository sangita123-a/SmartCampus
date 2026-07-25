export type BookStatus = 'AVAILABLE' | 'ISSUED' | 'RESERVED' | 'LOST' | 'DAMAGED';
export type IssueStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST';
export type ReservationStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';

export interface BookCategory {
  id: string;
  collegeId: string;
  name: string;
  description?: string;
  _count?: { books: number };
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  _count?: { books: number };
}

export interface Publisher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  _count?: { books: number };
}

export interface Book {
  id: string;
  collegeId: string;
  categoryId: string;
  authorId: string;
  publisherId: string;
  isbn: string;
  title: string;
  edition?: string;
  language: string;
  publicationYear?: number;
  totalCopies: number;
  availableCopies: number;
  rackNumber?: string;
  shelfNumber?: string;
  coverImage?: string;
  description?: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string };
  author?: { id: string; name: string };
  publisher?: { id: string; name: string };
  issues?: BookIssue[];
  reservations?: BookReservation[];
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId?: string;
  facultyId?: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: IssueStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  book?: Book;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string };
  faculty?: { id: string; firstName: string; lastName: string; employeeId: string };
}

export interface BookReservation {
  id: string;
  bookId: string;
  studentId: string;
  reservationDate: string;
  expiryDate: string;
  status: ReservationStatus;
  book?: Book;
  student?: { id: string; firstName: string; lastName: string; rollNumber: string };
}

export interface LibraryDashboardCardsData {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  reservedBooks: number;
  overdueBooks: number;
  fineCollected: number;
}
