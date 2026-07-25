import { Request, Response } from 'express';
import { collegeService } from '../services/college.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/express';
import { AppError } from '../utils/AppError';
import { CollegeQueryInput } from '../validators/college.validator';

function getActor(req: Request) {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    throw new AppError('Authentication required', 401);
  }
  return authReq.user;
}

export class CollegeController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const college = await collegeService.create(req.body);

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'College created successfully',
      data: { college },
    });
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const result = await collegeService.list(req.query as unknown as CollegeQueryInput, actor);

    return sendSuccess({
      res,
      message: 'Colleges fetched successfully',
      data: result,
    });
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const college = await collegeService.getById(req.params.id, actor);

    return sendSuccess({
      res,
      message: 'College fetched successfully',
      data: { college },
    });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const college = await collegeService.update(req.params.id, req.body, actor);

    return sendSuccess({
      res,
      message: 'College updated successfully',
      data: { college },
    });
  });

  public deactivate = asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const college = await collegeService.deactivate(req.params.id, actor);

    return sendSuccess({
      res,
      message: 'College deactivated successfully',
      data: { college },
    });
  });

  public reactivate = asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const college = await collegeService.reactivate(req.params.id, actor);

    return sendSuccess({
      res,
      message: 'College reactivated successfully',
      data: { college },
    });
  });

  public remove = asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    await collegeService.remove(req.params.id, actor);

    return sendSuccess({
      res,
      message: 'College deleted successfully',
    });
  });

  public dashboard = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await collegeService.getSuperAdminStats();

    return sendSuccess({
      res,
      message: 'Dashboard stats fetched successfully',
      data: { stats },
    });
  });
}

export const collegeController = new CollegeController();
