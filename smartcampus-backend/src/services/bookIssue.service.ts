import { BookStatus, IssueStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class BookIssueService {
  async listIssues(collegeId: string | null, query: any) {
    const pageNum = Math.max(1, Number(query.page) || 1);
    const limitNum = Math.max(1, Number(query.limit) || 10);
    const { search, status, studentId, facultyId } = query;
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(collegeId ? { book: { collegeId } } : {}),
      ...(status ? { status: status as IssueStatus } : {}),
      ...(studentId ? { studentId } : {}),
      ...(facultyId ? { facultyId } : {}),
      ...(search
        ? {
            OR: [
              { book: { title: { contains: search, mode: 'insensitive' as const } } },
              { book: { isbn: { contains: search, mode: 'insensitive' as const } } },
              { student: { firstName: { contains: search, mode: 'insensitive' as const } } },
              { student: { rollNumber: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [issues, total] = await Promise.all([
      prisma.bookIssue.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { issueDate: 'desc' },
        include: {
          book: { select: { id: true, title: true, isbn: true, coverImage: true } },
          student: { select: { id: true, firstName: true, lastName: true, rollNumber: true } },
          faculty: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        },
      }),
      prisma.bookIssue.count({ where }),
    ]);

    return {
      issues,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async issueBook(collegeId: string | null, data: any) {
    const { bookId, studentId, facultyId, dueDate, remarks } = data;

    if (!studentId && !facultyId) {
      throw new AppError('Either studentId or facultyId is required to issue a book', 400);
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new AppError('Book not found', 404);
    if (collegeId && book.collegeId !== collegeId) throw new AppError('Access denied', 403);

    if (book.availableCopies <= 0 || book.status === BookStatus.LOST || book.status === BookStatus.DAMAGED) {
      throw new AppError('No copies available for issue', 400);
    }

    // Check if user already borrowed this book without returning
    const activeIssue = await prisma.bookIssue.findFirst({
      where: {
        bookId,
        ...(studentId ? { studentId } : { facultyId }),
        status: { in: [IssueStatus.ISSUED, IssueStatus.OVERDUE] },
      },
    });

    if (activeIssue) {
      throw new AppError('This user already has an active issue of this book', 400);
    }

    return prisma.$transaction(async (tx) => {
      const issue = await tx.bookIssue.create({
        data: {
          bookId,
          studentId: studentId || null,
          facultyId: facultyId || null,
          issueDate: new Date(),
          dueDate: new Date(dueDate),
          status: IssueStatus.ISSUED,
          remarks: remarks || null,
        },
        include: {
          book: true,
          student: true,
          faculty: true,
        },
      });

      const updatedAvailable = book.availableCopies - 1;
      await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: updatedAvailable,
          status: updatedAvailable === 0 ? BookStatus.ISSUED : BookStatus.AVAILABLE,
        },
      });

      return issue;
    });
  }

  async returnBook(issueId: string, collegeId: string | null, data: any) {
    const issue = await prisma.bookIssue.findUnique({
      where: { id: issueId },
      include: { book: true },
    });

    if (!issue) throw new AppError('Book issue record not found', 404);
    if (collegeId && issue.book.collegeId !== collegeId) throw new AppError('Access denied', 403);
    if (issue.status === IssueStatus.RETURNED) throw new AppError('Book is already returned', 400);

    const returnDate = new Date();
    const dueDate = new Date(issue.dueDate);

    // Fine calculation: ₹10 / $5 per overdue day
    let fineAmount = data.fineAmount || 0;
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate.getTime() - dueDate.getTime());
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = overdueDays * 10;
    }

    return prisma.$transaction(async (tx) => {
      const updatedIssue = await tx.bookIssue.update({
        where: { id: issueId },
        data: {
          returnDate,
          fineAmount,
          status: IssueStatus.RETURNED,
          remarks: data.remarks || issue.remarks,
        },
        include: { book: true, student: true, faculty: true },
      });

      await tx.book.update({
        where: { id: issue.bookId },
        data: {
          availableCopies: { increment: 1 },
          status: BookStatus.AVAILABLE,
        },
      });

      return updatedIssue;
    });
  }
}

export const bookIssueService = new BookIssueService();
