import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { reportService } from '../services/report.service';

export class ReportController {
  getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;

    const data = await reportService.getDashboardAnalytics(collegeId);
    res.json({ success: true, data });
  });

  getStudentReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;
    const departmentId = req.query.departmentId as string | undefined;
    const courseId = req.query.courseId as string | undefined;

    const data = await reportService.getStudentReports({ collegeId, departmentId, courseId });
    res.json({ success: true, data });
  });

  getFacultyReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;
    const departmentId = req.query.departmentId as string | undefined;

    const data = await reportService.getFacultyReports({ collegeId, departmentId });
    res.json({ success: true, data });
  });

  getAttendanceReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;
    const departmentId = req.query.departmentId as string | undefined;
    const courseId = req.query.courseId as string | undefined;

    const data = await reportService.getAttendanceReports({ collegeId, departmentId, courseId });
    res.json({ success: true, data });
  });

  getFeeReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;
    const departmentId = req.query.departmentId as string | undefined;

    const data = await reportService.getFeeReports({ collegeId, departmentId });
    res.json({ success: true, data });
  });

  getExamReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;
    const departmentId = req.query.departmentId as string | undefined;

    const data = await reportService.getExamReports({ collegeId, departmentId });
    res.json({ success: true, data });
  });

  getLibraryReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? (req.query.collegeId as string | undefined) : user.collegeId;

    const data = await reportService.getLibraryReports({ collegeId });
    res.json({ success: true, data });
  });
}

export const reportController = new ReportController();
