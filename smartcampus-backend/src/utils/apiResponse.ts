import { Response } from 'express';

interface ApiSuccessOptions<T> {
  res: Response;
  message: string;
  data?: T;
  statusCode?: number;
}

interface ApiErrorOptions {
  res: Response;
  message: string;
  statusCode?: number;
  errors?: unknown;
}

export function sendSuccess<T>({
  res,
  message,
  data,
  statusCode = 200,
}: ApiSuccessOptions<T>): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
}

export function sendError({
  res,
  message,
  statusCode = 500,
  errors,
}: ApiErrorOptions): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  });
}
