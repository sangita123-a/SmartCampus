import { z } from 'zod';
import { BookStatus, IssueStatus } from '@prisma/client';

export const createBookCategorySchema = z.object({
  collegeId: z.string().optional(),
  name: z.string({ required_error: 'Category name is required' }),
  description: z.string().optional(),
});

export const createAuthorSchema = z.object({
  name: z.string({ required_error: 'Author name is required' }),
  bio: z.string().optional(),
});

export const createPublisherSchema = z.object({
  name: z.string({ required_error: 'Publisher name is required' }),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const createBookSchema = z.object({
  collegeId: z.string().optional(),
  categoryId: z.string({ required_error: 'Category ID is required' }),
  authorId: z.string({ required_error: 'Author ID is required' }),
  publisherId: z.string({ required_error: 'Publisher ID is required' }),
  isbn: z.string({ required_error: 'ISBN is required' }),
  title: z.string({ required_error: 'Book title is required' }),
  edition: z.string().optional(),
  language: z.string().optional().default('English'),
  publicationYear: z.number().optional(),
  totalCopies: z.number().min(1, { message: 'Total copies must be at least 1' }).default(1),
  rackNumber: z.string().optional(),
  shelfNumber: z.string().optional(),
  coverImage: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(BookStatus).optional().default(BookStatus.AVAILABLE),
});

export const updateBookSchema = createBookSchema.partial();

export const issueBookSchema = z.object({
  bookId: z.string({ required_error: 'Book ID is required' }),
  studentId: z.string().optional(),
  facultyId: z.string().optional(),
  dueDate: z.string({ required_error: 'Due date is required' }),
  remarks: z.string().optional(),
});

export const returnBookSchema = z.object({
  fineAmount: z.number().min(0).optional().default(0),
  remarks: z.string().optional(),
  status: z.nativeEnum(IssueStatus).optional().default(IssueStatus.RETURNED),
});

export const createReservationSchema = z.object({
  bookId: z.string({ required_error: 'Book ID is required' }),
  studentId: z.string({ required_error: 'Student ID is required' }),
  expiryDate: z.string({ required_error: 'Expiry date is required' }),
});

export const bookQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  publisherId: z.string().optional(),
  status: z.nativeEnum(BookStatus).optional(),
});

export const idParamSchema = z.object({
  id: z.string({ required_error: 'ID parameter is required' }),
});
