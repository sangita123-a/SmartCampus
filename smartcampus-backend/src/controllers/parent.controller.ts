import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { parentService } from '../services/parent.service';

export class ParentController {
  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await parentService.getDashboard(user.id);
    res.json({ success: true, data });
  });

  getLinkedStudents = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await parentService.getLinkedStudents(user.id);
    res.json({ success: true, data });
  });

  getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await parentService.validateParentChildAccess(user.id, req.params.studentId);
    res.json({ success: true, data });
  });

  getAttendance = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const studentId = req.query.studentId as string | undefined;
    const data = await parentService.getAttendance(user.id, studentId);
    res.json({ success: true, data });
  });

  getResults = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const studentId = req.query.studentId as string | undefined;
    const data = await parentService.getResults(user.id, studentId);
    res.json({ success: true, data });
  });

  getFees = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const studentId = req.query.studentId as string | undefined;
    const data = await parentService.getFees(user.id, studentId);
    res.json({ success: true, data });
  });

  getTimetable = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const studentId = req.query.studentId as string | undefined;
    const data = await parentService.getTimetable(user.id, studentId);
    res.json({ success: true, data });
  });

  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await parentService.getNotifications(user.id);
    res.json({ success: true, data });
  });

  linkStudentToParent = asyncHandler(async (req: Request, res: Response) => {
    const data = await parentService.linkStudentToParent(req.body);
    res.status(201).json({ success: true, data });
  });
}

export const parentController = new ParentController();
