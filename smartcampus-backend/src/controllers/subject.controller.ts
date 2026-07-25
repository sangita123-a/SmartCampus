import { Request, Response } from 'express';
import { subjectService } from '../services/subject.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/express';
import { AppError } from '../utils/AppError';
import {
  AssignFacultyInput,
  BulkSubjectIdsInput,
  BulkSubjectStatusInput,
  SubjectExportInput,
  SubjectQueryInput,
} from '../validators/subject.validator';

function getActor(req: Request) {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    throw new AppError('Authentication required', 401);
  }
  return authReq.user;
}

export class SubjectController {
  public dashboard = asyncHandler(async (req: Request, res: Response) => {
    const stats = await subjectService.getDashboardStats(getActor(req));
    return sendSuccess({
      res,
      message: 'Subject dashboard stats fetched successfully',
      data: { stats },
    });
  });

  public create = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectService.create(req.body, getActor(req));
    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Subject created successfully',
      data: { subject },
    });
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const result = await subjectService.list(
      req.query as unknown as SubjectQueryInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: 'Subjects fetched successfully',
      data: result,
    });
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectService.getById(req.params.id, getActor(req));
    return sendSuccess({
      res,
      message: 'Subject fetched successfully',
      data: { subject },
    });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectService.update(req.params.id, req.body, getActor(req));
    return sendSuccess({
      res,
      message: 'Subject updated successfully',
      data: { subject },
    });
  });

  public assignFaculty = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectService.assignFaculty(
      req.params.id,
      req.body as AssignFacultyInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: 'Faculty assigned successfully',
      data: { subject },
    });
  });

  public removeFaculty = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectService.removeFaculty(req.params.id, getActor(req));
    return sendSuccess({
      res,
      message: 'Faculty removed from subject successfully',
      data: { subject },
    });
  });

  public remove = asyncHandler(async (req: Request, res: Response) => {
    await subjectService.remove(req.params.id, getActor(req));
    return sendSuccess({
      res,
      message: 'Subject deleted successfully',
    });
  });

  public bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await subjectService.bulkDelete(
      req.body as BulkSubjectIdsInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: `${deleted} subject(s) deleted successfully`,
      data: { deleted },
    });
  });

  public bulkStatus = asyncHandler(async (req: Request, res: Response) => {
    const updated = await subjectService.bulkUpdateStatus(
      req.body as BulkSubjectStatusInput,
      getActor(req)
    );
    return sendSuccess({
      res,
      message: `${updated} subject(s) updated successfully`,
      data: { updated },
    });
  });

  public export = asyncHandler(async (req: Request, res: Response) => {
    const result = await subjectService.exportSubjects(
      req.query as unknown as SubjectExportInput,
      getActor(req)
    );
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    return res.status(200).send(result.buffer);
  });
}

export const subjectController = new SubjectController();
