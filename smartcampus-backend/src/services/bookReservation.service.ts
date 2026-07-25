import { ReservationStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class BookReservationService {
  async listReservations(collegeId: string | null) {
    return prisma.bookReservation.findMany({
      where: collegeId ? { book: { collegeId } } : {},
      orderBy: { reservationDate: 'desc' },
      include: {
        book: { select: { id: true, title: true, isbn: true } },
        student: { select: { id: true, firstName: true, lastName: true, rollNumber: true } },
      },
    });
  }

  async reserveBook(collegeId: string | null, data: any) {
    const { bookId, studentId, expiryDate } = data;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new AppError('Book not found', 404);
    if (collegeId && book.collegeId !== collegeId) throw new AppError('Access denied', 403);

    const existingPending = await prisma.bookReservation.findFirst({
      where: { bookId, studentId, status: ReservationStatus.PENDING },
    });

    if (existingPending) {
      throw new AppError('You already have a pending reservation for this book', 400);
    }

    return prisma.bookReservation.create({
      data: {
        bookId,
        studentId,
        expiryDate: new Date(expiryDate),
        status: ReservationStatus.PENDING,
      },
      include: { book: true, student: true },
    });
  }

  async cancelReservation(id: string, collegeId: string | null) {
    const reservation = await prisma.bookReservation.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!reservation) throw new AppError('Reservation not found', 404);
    if (collegeId && reservation.book.collegeId !== collegeId) throw new AppError('Access denied', 403);

    return prisma.bookReservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });
  }
}

export const bookReservationService = new BookReservationService();
