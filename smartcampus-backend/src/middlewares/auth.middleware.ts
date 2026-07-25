import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { tokenService } from '../utils/jwt';
import { AuthenticatedRequest } from '../types/express';
import { Role } from '../types/roles';

/**
 * Verifies JWT access token from Authorization: Bearer <token>
 * and attaches the authenticated user to the request.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      next(new AppError('Authentication required', 401));
      return;
    }

    const token = header.slice(7).trim();
    if (!token) {
      next(new AppError('Authentication required', 401));
      return;
    }

    const payload = tokenService.verifyAccessToken(token);
    const authReq = req as AuthenticatedRequest;

    authReq.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Role,
      collegeId: payload.collegeId ?? null,
    };

    next();
  } catch {
    next(new AppError('Invalid or expired access token', 401));
  }
};

/**
 * Optional auth — attaches user when token is present, otherwise continues.
 */
export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const token = header.slice(7).trim();
    const payload = tokenService.verifyAccessToken(token);
    const authReq = req as AuthenticatedRequest;

    authReq.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Role,
      collegeId: payload.collegeId ?? null,
    };
  } catch {
    // Ignore invalid token for optional auth
  }

  next();
};
