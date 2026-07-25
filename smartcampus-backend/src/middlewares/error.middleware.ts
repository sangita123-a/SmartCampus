import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational error', err);
    }

    return sendError({
      res,
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  return sendError({
    res,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    statusCode: 500,
  });
};
