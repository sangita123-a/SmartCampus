import { BookStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class BookService {
  async listBooks(collegeId: string | null, query: any) {
    const { page = 1, limit = 10, search, categoryId, authorId, publisherId, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(authorId ? { authorId } : {}),
      ...(publisherId ? { publisherId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { isbn: { contains: search, mode: 'insensitive' } },
              { author: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: 'asc' },
        include: {
          category: { select: { id: true, name: true } },
          author: { select: { id: true, name: true } },
          publisher: { select: { id: true, name: true } },
        },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookById(id: string, collegeId: string | null) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        publisher: true,
        issues: {
          take: 10,
          orderBy: { issueDate: 'desc' },
          include: {
            student: { select: { id: true, firstName: true, lastName: true, rollNumber: true } },
            faculty: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
          },
        },
        reservations: {
          where: { status: 'PENDING' },
          include: { student: { select: { id: true, firstName: true, lastName: true, rollNumber: true } } },
        },
      },
    });

    if (!book) throw new AppError('Book not found', 404);
    if (collegeId && book.collegeId !== collegeId) throw new AppError('Access denied', 403);

    return book;
  }

  async createBook(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) throw new AppError('College ID is required', 400);

    const existingIsbn = await prisma.book.findUnique({ where: { isbn: data.isbn } });
    if (existingIsbn) throw new AppError(`Book with ISBN "${data.isbn}" already exists`, 400);

    const totalCopies = data.totalCopies || 1;

    return prisma.book.create({
      data: {
        collegeId: targetCollegeId,
        categoryId: data.categoryId,
        authorId: data.authorId,
        publisherId: data.publisherId,
        isbn: data.isbn,
        title: data.title,
        edition: data.edition || null,
        language: data.language || 'English',
        publicationYear: data.publicationYear ? Number(data.publicationYear) : null,
        totalCopies,
        availableCopies: totalCopies,
        rackNumber: data.rackNumber || null,
        shelfNumber: data.shelfNumber || null,
        coverImage: data.coverImage || null,
        description: data.description || null,
        status: data.status || BookStatus.AVAILABLE,
      },
      include: { category: true, author: true, publisher: true },
    });
  }

  async updateBook(id: string, collegeId: string | null, data: any) {
    await this.getBookById(id, collegeId);

    return prisma.book.update({
      where: { id },
      data,
      include: { category: true, author: true, publisher: true },
    });
  }

  async deleteBook(id: string, collegeId: string | null) {
    await this.getBookById(id, collegeId);
    return prisma.book.delete({ where: { id } });
  }
}

export const bookService = new BookService();
