import { Request, Response } from 'express';

import { departmentService } from '../services/department.service';

import { sendSuccess } from '../utils/apiResponse';

import { asyncHandler } from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/express';

import { AppError } from '../utils/AppError';

import { DepartmentQueryInput } from '../validators/department.validator';



function getActor(req: Request) {

  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {

    throw new AppError('Authentication required', 401);

  }

  return authReq.user;

}



export class DepartmentController {

  public create = asyncHandler(async (req: Request, res: Response) => {

    const department = await departmentService.create(req.body, getActor(req));



    return sendSuccess({

      res,

      statusCode: 201,

      message: 'Department created successfully',

      data: { department },

    });

  });



  public list = asyncHandler(async (req: Request, res: Response) => {

    const result = await departmentService.list(

      req.query as unknown as DepartmentQueryInput,

      getActor(req)

    );



    return sendSuccess({

      res,

      message: 'Departments fetched successfully',

      data: result,

    });

  });



  public getById = asyncHandler(async (req: Request, res: Response) => {

    const department = await departmentService.getById(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Department fetched successfully',

      data: { department },

    });

  });



  public update = asyncHandler(async (req: Request, res: Response) => {

    const department = await departmentService.update(

      req.params.id,

      req.body,

      getActor(req)

    );



    return sendSuccess({

      res,

      message: 'Department updated successfully',

      data: { department },

    });

  });



  public toggleStatus = asyncHandler(async (req: Request, res: Response) => {

    const department = await departmentService.toggleStatus(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Department status updated successfully',

      data: { department },

    });

  });



  public remove = asyncHandler(async (req: Request, res: Response) => {

    await departmentService.remove(req.params.id, getActor(req));



    return sendSuccess({

      res,

      message: 'Department deleted successfully',

    });

  });

}



export const departmentController = new DepartmentController();

