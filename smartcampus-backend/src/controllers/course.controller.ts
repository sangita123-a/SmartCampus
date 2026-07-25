import { Request, Response } from 'express';

import { courseService } from '../services/course.service';

import { sendSuccess } from '../utils/apiResponse';

import { asyncHandler } from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/express';

import { AppError } from '../utils/AppError';

import { CourseQueryInput } from '../validators/course.validator';



function getActor(req: Request) {

  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {

    throw new AppError('Authentication required', 401);

  }

  return authReq.user;

}



export class CourseController {

  public create = asyncHandler(async (req: Request, res: Response) => {

    const course = await courseService.create(req.body, getActor(req));



    return sendSuccess({

      res,

      statusCode: 201,

      message: 'Course created successfully',

      data: { course },

    });

  });



  public list = asyncHandler(async (req: Request, res: Response) => {

    const result = await courseService.list(

      req.query as unknown as CourseQueryInput,

      getActor(req)

    );



    return sendSuccess({

      res,

      message: 'Courses fetched successfully',

      data: result,

    });

  });



  public getById = asyncHandler(async (req: Request, res: Response) => {

    const course = await courseService.getById(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Course fetched successfully',

      data: { course },

    });

  });



  public update = asyncHandler(async (req: Request, res: Response) => {

    const course = await courseService.update(req.params.id, req.body, getActor(req));



    return sendSuccess({

      res,

      message: 'Course updated successfully',

      data: { course },

    });

  });



  public toggleStatus = asyncHandler(async (req: Request, res: Response) => {

    const course = await courseService.toggleStatus(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Course status updated successfully',

      data: { course },

    });

  });



  public remove = asyncHandler(async (req: Request, res: Response) => {

    await courseService.remove(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Course deleted successfully',

    });

  });

}



export const courseController = new CourseController();

