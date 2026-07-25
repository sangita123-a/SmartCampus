import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { examService } from '../services/exam.service';
import { resultService } from '../services/result.service';
import { hallTicketService } from '../services/hallTicket.service';
import { examDashboardService } from '../services/examDashboard.service';

export class ExamController {
  // Exams
  listExams = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await examService.listExams(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  getExamById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await examService.getExamById(req.params.id, collegeId);
    res.json({ success: true, data });
  });

  createExam = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.collegeId || req.body.collegeId;
    const data = await examService.createExam(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  updateExam = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await examService.updateExam(req.params.id, collegeId, req.body);
    res.json({ success: true, data });
  });

  deleteExam = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    await examService.deleteExam(req.params.id, collegeId);
    res.json({ success: true, message: 'Exam deleted successfully' });
  });

  // Exam Subjects
  addExamSubject = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await examService.addExamSubject(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  removeExamSubject = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    await examService.removeExamSubject(req.params.id, collegeId);
    res.json({ success: true, message: 'Exam subject removed successfully' });
  });

  // Marks Entry & Publishing
  bulkSaveMarks = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await resultService.bulkSaveMarks(collegeId, req.body);
    res.status(201).json({ success: true, ...result });
  });

  publishResults = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await resultService.publishResults(req.params.id, collegeId);
    res.json({ success: true, data, message: 'Results published successfully' });
  });

  unpublishResults = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await resultService.unpublishResults(req.params.id, collegeId);
    res.json({ success: true, data, message: 'Results unpublished successfully' });
  });

  // Student Marksheet & Rank List
  getStudentMarksheet = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const { studentId, examId } = req.params;
    const data = await resultService.getStudentMarksheet(studentId, examId, collegeId);
    res.json({ success: true, data });
  });

  getRankList = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await resultService.getRankList(req.params.examId, collegeId);
    res.json({ success: true, data });
  });

  // Hall Tickets
  getHallTicket = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const { studentId, examId } = req.params;
    const data = await hallTicketService.generateHallTicket(studentId, examId, collegeId);
    res.json({ success: true, data });
  });

  // Dashboard Cards
  getDashboardCards = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await examDashboardService.getDashboardCards(collegeId);
    res.json({ success: true, data });
  });
}

export const examController = new ExamController();
