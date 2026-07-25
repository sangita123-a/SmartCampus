import { Request, Response } from 'express';
import { TenantRequest } from '../middlewares/tenant.middleware';
import { classroomService } from '../services/classroom.service';
import { asyncHandler } from '../utils/asyncHandler';

export class ClassroomController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const result = await classroomService.listClassrooms(tenantReq.tenantId || null, req.query as any);

    res.status(200).json({
      success: true,
      message: 'Classrooms fetched successfully',
      data: result.classrooms,
      meta: result.meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const classroom = await classroomService.getClassroomById(req.params.id, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Classroom details fetched successfully',
      data: classroom,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const classroom = await classroomService.createClassroom(tenantReq.tenantId || req.body.collegeId, req.body);

    res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: classroom,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const classroom = await classroomService.updateClassroom(req.params.id, tenantReq.tenantId || null, req.body);

    res.status(200).json({
      success: true,
      message: 'Classroom updated successfully',
      data: classroom,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    await classroomService.deleteClassroom(req.params.id, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Classroom deleted successfully',
    });
  });
}

export const classroomController = new ClassroomController();
