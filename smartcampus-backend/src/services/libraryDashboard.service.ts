import { IssueStatus, ReservationStatus } from '@prisma/client';
import { prisma } from '../config/database';

export class LibraryDashboardService {
  async getDashboardCards(collegeId: string | null) {
    const whereCollege = collegeId ? { collegeId } : {};

    const [
      totalBooks,
      availableBooksSum,
      issuedBooksCount,
      reservedBooksCount,
      overdueBooksCount,
      fineCollectedAggregate,
    ] = await Promise.all([
      // Total Distinct Titles
      prisma.book.count({ where: whereCollege }),

      // Total Available Copies Sum
      prisma.book.aggregate({
        where: whereCollege,
        _sum: { availableCopies: true },
      }),

      // Currently Issued Books Count
      prisma.bookIssue.count({
        where: {
          status: IssueStatus.ISSUED,
          ...(collegeId ? { book: { collegeId } } : {}),
        },
      }),

      // Currently Pending Reservations Count
      prisma.bookReservation.count({
        where: {
          status: ReservationStatus.PENDING,
          ...(collegeId ? { book: { collegeId } } : {}),
        },
      }),

      // Overdue Books Count (due date < now & not returned)
      prisma.bookIssue.count({
        where: {
          status: { in: [IssueStatus.ISSUED, IssueStatus.OVERDUE] },
          dueDate: { lt: new Date() },
          ...(collegeId ? { book: { collegeId } } : {}),
        },
      }),

      // Fine Collected Sum
      prisma.bookIssue.aggregate({
        where: {
          ...(collegeId ? { book: { collegeId } } : {}),
        },
        _sum: { fineAmount: true },
      }),
    ]);

    return {
      totalBooks,
      availableBooks: availableBooksSum._sum.availableCopies || 0,
      issuedBooks: issuedBooksCount,
      reservedBooks: reservedBooksCount,
      overdueBooks: overdueBooksCount,
      fineCollected: Number(fineCollectedAggregate._sum.fineAmount || 0),
    };
  }
}

export const libraryDashboardService = new LibraryDashboardService();
