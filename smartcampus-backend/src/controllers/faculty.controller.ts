import { Request, Response } from 'express';
import { facultyService } from '../services/faculty.service';
import { uploadImageBuffer } from '../config/cloudinary';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/express';
import { AppError } from '../utils/AppError';
import {
  BulkFacultyIdsInput,
  BulkFacultyStatusInput,
  FacultyExportInput,
  FacultyQueryInput,
} from '../validators/faculty.validator';

function getActor(req: Request) {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    throw new AppError('Authentication required', 401);
  }
  return authReq.user;
}

export class FacultyController {
  public dashboard = asyncHandler(async (req: Request, res: Response) => {
    const stats = await facultyService.getDashboardStats(getActor(req));
    return sendSuccess({
      res,
      message: 'Faculty dashboard stats fetched successfully',
      data: { stats },
    });
  });

  public create = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.create(req.body, getActor(req));
    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Faculty created successfully',
      data: { faculty },
    });
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const result = await facultyService.list(
      req.query as unknown as FacultyQueryInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: 'Faculty fetched successfully',
      data: result,
    });
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.getById(req.params.id, getActor(req));
    return sendSuccess({
      res,
      message: 'Faculty fetched successfully',
      data: { faculty },
    });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.update(req.params.id, req.body, getActor(req));
    return sendSuccess({
      res,
      message: 'Faculty updated successfully',
      data: { faculty },
    });
  });

  public remove = asyncHandler(async (req: Request, res: Response) => {
    await facultyService.remove(req.params.id, getActor(req));
    return sendSuccess({
      res,
      message: 'Faculty deleted successfully',
    });
  });

  public bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await facultyService.bulkDelete(
      req.body as BulkFacultyIdsInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: `${deleted} faculty record(s) deleted successfully`,
      data: { deleted },
    });
  });

  public bulkStatus = asyncHandler(async (req: Request, res: Response) => {
    const updated = await facultyService.bulkUpdateStatus(
      req.body as BulkFacultyStatusInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: `${updated} faculty record(s) updated successfully`,
      data: { updated },
    });
  });

  public export = asyncHandler(async (req: Request, res: Response) => {
    const result = await facultyService.exportFaculty(
      req.query as unknown as FacultyExportInput,
      getActor(req)
    );
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    return res.status(200).send(result.buffer);
  });

  public import = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw new AppError('Import file is required', 400);
    const result = await facultyService.importFaculty(file.buffer, getActor(req));
    return sendSuccess({
      res,
      message: 'Faculty import completed',
      data: { result },
    });
  });

  public uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw new AppError('Image file is required', 400);
    const url = await uploadImageBuffer(file.buffer, 'smartcampus/faculty');
    return sendSuccess({
      res,
      message: 'Image uploaded successfully',
      data: { url },
    });
  });
}

export const facultyController = new FacultyController();
