import { Request, Response } from 'express';

import { studentService } from '../services/student.service';

import { uploadImageBuffer } from '../config/cloudinary';

import { sendSuccess } from '../utils/apiResponse';

import { asyncHandler } from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/express';

import { AppError } from '../utils/AppError';

import {

  BulkIdsInput,

  BulkStatusInput,

  ExportFormatInput,

  StudentQueryInput,

} from '../validators/student.validator';



function getActor(req: Request) {

  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {

    throw new AppError('Authentication required', 401);

  }

  return authReq.user;

}



export class StudentController {

  public dashboard = asyncHandler(async (req: Request, res: Response) => {

    const stats = await studentService.getDashboardStats(getActor(req));

    return sendSuccess({

      res,

      message: 'Student dashboard stats fetched successfully',

      data: { stats },

    });

  });



  public create = asyncHandler(async (req: Request, res: Response) => {

    const student = await studentService.create(req.body, getActor(req));

    return sendSuccess({

      res,

      statusCode: 201,

      message: 'Student created successfully',

      data: { student },

    });

  });



  public list = asyncHandler(async (req: Request, res: Response) => {

    const result = await studentService.list(

      req.query as unknown as StudentQueryInput,

      getActor(req)

    );

    return sendSuccess({

      res,

      message: 'Students fetched successfully',

      data: result,

    });

  });



  public getById = asyncHandler(async (req: Request, res: Response) => {

    const student = await studentService.getById(req.params.id, getActor(req));

    return sendSuccess({

      res,

      message: 'Student fetched successfully',

      data: { student },

    });

  });



  public update = asyncHandler(async (req: Request, res: Response) => {

    const student = await studentService.update(req.params.id, req.body, getActor(req));

    return sendSuccess({

      res,

      message: 'Student updated successfully',

      data: { student },

    });

  });



  public remove = asyncHandler(async (req: Request, res: Response) => {

    await studentService.remove(req.params.id, getActor(req));

    return sendSuccess({

      res,

      message: 'Student deleted successfully',

    });

  });



  public bulkDelete = asyncHandler(async (req: Request, res: Response) => {

    const deleted = await studentService.bulkDelete(

      req.body as BulkIdsInput,

      getActor(req)

    );

    return sendSuccess({

      res,

      message: `${deleted} student(s) deleted successfully`,

      data: { deleted },

    });

  });



  public bulkStatus = asyncHandler(async (req: Request, res: Response) => {

    const updated = await studentService.bulkUpdateStatus(

      req.body as BulkStatusInput,

      getActor(req)

    );

    return sendSuccess({

      res,

      message: `${updated} student(s) updated successfully`,

      data: { updated },

    });

  });



  public export = asyncHandler(async (req: Request, res: Response) => {

    const result = await studentService.exportStudents(

      req.query as unknown as ExportFormatInput,

      getActor(req)

    );



    res.setHeader('Content-Type', result.contentType);

    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    return res.status(200).send(result.buffer);

  });



  public import = asyncHandler(async (req: Request, res: Response) => {

    const file = req.file;

    if (!file) {

      throw new AppError('Import file is required', 400);

    }



    const result = await studentService.importStudents(file.buffer, getActor(req));

    return sendSuccess({

      res,

      message: 'Student import completed',

      data: { result },

    });

  });



  public uploadImage = asyncHandler(async (req: Request, res: Response) => {

    const file = req.file;

    if (!file) {

      throw new AppError('Image file is required', 400);

    }



    const url = await uploadImageBuffer(file.buffer);

    return sendSuccess({

      res,

      message: 'Image uploaded successfully',

      data: { url },

    });

  });

}



export const studentController = new StudentController();

