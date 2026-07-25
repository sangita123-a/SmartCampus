import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { libraryCategoryService } from '../services/libraryCategory.service';
import { authorService } from '../services/author.service';
import { publisherService } from '../services/publisher.service';
import { bookService } from '../services/book.service';
import { bookIssueService } from '../services/bookIssue.service';
import { bookReservationService } from '../services/bookReservation.service';
import { libraryDashboardService } from '../services/libraryDashboard.service';

export class LibraryController {
  // Categories
  listCategories = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await libraryCategoryService.listCategories(collegeId);
    res.json({ success: true, data });
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.collegeId || req.body.collegeId;
    const data = await libraryCategoryService.createCategory(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    await libraryCategoryService.deleteCategory(req.params.id, collegeId);
    res.json({ success: true, message: 'Category deleted successfully' });
  });

  // Authors & Publishers
  listAuthors = asyncHandler(async (_req: Request, res: Response) => {
    const data = await authorService.listAuthors();
    res.json({ success: true, data });
  });

  createAuthor = asyncHandler(async (req: Request, res: Response) => {
    const data = await authorService.createAuthor(req.body);
    res.status(201).json({ success: true, data });
  });

  listPublishers = asyncHandler(async (_req: Request, res: Response) => {
    const data = await publisherService.listPublishers();
    res.json({ success: true, data });
  });

  createPublisher = asyncHandler(async (req: Request, res: Response) => {
    const data = await publisherService.createPublisher(req.body);
    res.status(201).json({ success: true, data });
  });

  // Books Inventory
  listBooks = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await bookService.listBooks(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  getBookById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookService.getBookById(req.params.id, collegeId);
    res.json({ success: true, data });
  });

  createBook = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.collegeId || req.body.collegeId;
    const data = await bookService.createBook(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  updateBook = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookService.updateBook(req.params.id, collegeId, req.body);
    res.json({ success: true, data });
  });

  deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    await bookService.deleteBook(req.params.id, collegeId);
    res.json({ success: true, message: 'Book deleted successfully' });
  });

  // Book Issues & Returns
  listIssues = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await bookIssueService.listIssues(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  issueBook = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookIssueService.issueBook(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  returnBook = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookIssueService.returnBook(req.params.id, collegeId, req.body);
    res.json({ success: true, data, message: 'Book returned successfully' });
  });

  // Book Reservations
  listReservations = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookReservationService.listReservations(collegeId);
    res.json({ success: true, data });
  });

  reserveBook = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookReservationService.reserveBook(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await bookReservationService.cancelReservation(req.params.id, collegeId);
    res.json({ success: true, data, message: 'Reservation cancelled successfully' });
  });

  // Dashboard Cards
  getDashboardCards = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await libraryDashboardService.getDashboardCards(collegeId);
    res.json({ success: true, data });
  });
}

export const libraryController = new LibraryController();
