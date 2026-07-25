import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type RequestPart = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const value = req[part] ?? (part === 'body' ? {} : req[part]);
    const result = schema.safeParse(value);

    if (!result.success) {
      next(
        new AppError('Validation failed', 400, result.error.flatten().fieldErrors)
      );
      return;
    }

    req[part] = result.data;
    next();
  };
