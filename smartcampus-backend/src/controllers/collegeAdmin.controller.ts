import { Request, Response } from 'express';

import { collegeAdminService } from '../services/collegeAdmin.service';

import { sendSuccess } from '../utils/apiResponse';

import { asyncHandler } from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/express';

import { AppError } from '../utils/AppError';



function getActor(req: Request) {

  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {

    throw new AppError('Authentication required', 401);

  }

  return authReq.user;

}



export class CollegeAdminController {

  public dashboard = asyncHandler(async (req: Request, res: Response) => {

    const stats = await collegeAdminService.getDashboardStats(getActor(req));



    return sendSuccess({

      res,

      message: 'College admin dashboard stats fetched successfully',

      data: { stats },

    });

  });

}



export const collegeAdminController = new CollegeAdminController();

