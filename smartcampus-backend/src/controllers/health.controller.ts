import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';

export class HealthController {
  public check(_req: Request, res: Response): Response {
    return sendSuccess({
      res,
      message: 'Backend Running Successfully',
    });
  }
}

export const healthController = new HealthController();
