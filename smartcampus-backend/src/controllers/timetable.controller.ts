import { Request, Response } from 'express';
import { TenantRequest } from '../middlewares/tenant.middleware';
import { timetableService } from '../services/timetable.service';
import { asyncHandler } from '../utils/asyncHandler';

export class TimetableController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const result = await timetableService.listTimetable(tenantReq.tenantId || null, req.query as any);

    res.status(200).json({
      success: true,
      message: 'Timetable slots fetched successfully',
      data: result.timetables,
      meta: result.meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const entry = await timetableService.getTimetableById(req.params.id, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Timetable slot details fetched successfully',
      data: entry,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const entry = await timetableService.createTimetable(tenantReq.tenantId || req.body.collegeId, req.body);

    res.status(201).json({
      success: true,
      message: 'Timetable slot scheduled successfully',
      data: entry,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const entry = await timetableService.updateTimetable(req.params.id, tenantReq.tenantId || null, req.body);

    res.status(200).json({
      success: true,
      message: 'Timetable slot updated successfully',
      data: entry,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    await timetableService.deleteTimetable(req.params.id, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Timetable slot deleted successfully',
    });
  });

  dashboard = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const cards = await timetableService.getDashboardCards(tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Timetable dashboard cards fetched successfully',
      data: cards,
    });
  });

  weeklyView = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const result = await timetableService.getWeeklyView(tenantReq.tenantId || null, {
      semesterId: req.query.semesterId as string,
      facultyId: req.query.facultyId as string,
      classroomId: req.query.classroomId as string,
    });

    res.status(200).json({
      success: true,
      message: 'Weekly timetable view fetched successfully',
      data: result,
    });
  });
}

export const timetableController = new TimetableController();
