import { Request, Response } from 'express';

import { semesterService } from '../services/semester.service';

import { sendSuccess } from '../utils/apiResponse';

import { asyncHandler } from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/express';

import { AppError } from '../utils/AppError';

import { SemesterQueryInput } from '../validators/semester.validator';



function getActor(req: Request) {

  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {

    throw new AppError('Authentication required', 401);

  }

  return authReq.user;

}



export class SemesterController {

  public create = asyncHandler(async (req: Request, res: Response) => {

    const semester = await semesterService.create(req.body, getActor(req));



    return sendSuccess({

      res,

      statusCode: 201,

      message: 'Semester created successfully',

      data: { semester },

    });

  });



  public list = asyncHandler(async (req: Request, res: Response) => {

    const result = await semesterService.list(

      req.query as unknown as SemesterQueryInput,

      getActor(req)

    );



    return sendSuccess({

      res,

      message: 'Semesters fetched successfully',

      data: result,

    });

  });



  public getById = asyncHandler(async (req: Request, res: Response) => {

    const semester = await semesterService.getById(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Semester fetched successfully',

      data: { semester },

    });

  });



  public update = asyncHandler(async (req: Request, res: Response) => {

    const semester = await semesterService.update(req.params.id, req.body, getActor(req));



    return sendSuccess({

      res,

      message: 'Semester updated successfully',

      data: { semester },

    });

  });



  public toggleStatus = asyncHandler(async (req: Request, res: Response) => {

    const semester = await semesterService.toggleStatus(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Semester status updated successfully',

      data: { semester },

    });

  });



  public remove = asyncHandler(async (req: Request, res: Response) => {

    await semesterService.remove(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Semester deleted successfully',

    });

  });

}



export const semesterController = new SemesterController();

